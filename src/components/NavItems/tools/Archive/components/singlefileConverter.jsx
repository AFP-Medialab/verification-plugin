import React, { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import {
  toByteArray as decodeBase64,
  fromByteArray as encodeBase64,
} from "base64-js";
import { downloadZip, makeZip } from "client-zip";
import { sha256 } from "hash-wasm";
import {
  CDXAndRecordIndexer,
  CDXIndexer,
  WARCRecord,
  WARCSerializer,
} from "warcio";

import useAuthenticatedRequest from "../../../../Shared/Authentication/useAuthenticatedRequest";

const SinglefileConverter = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  const [fileInput, setFileInput] = useState(/** @type {File?} */ null);
  const [error, setError] = useState("");
  const authenticatedRequest = useAuthenticatedRequest();

  const domainCertSign = async (hash) => {
    const resp = await authenticatedRequest({
      url: process.env.REACT_APP_WACZ_SIGNING + hash,
      method: "get",
    });
    // console.log(resp)
    if (resp.status === 200) {
      const respJson = resp.data;
      console.log(respJson);
      return respJson;
    } else {
      setError("Error signing WACZ, please try again");
      throw new Exception();
    }
  };

  const sign = async (hash) => {
    //implementation derived from webrecorder's awp-sw library
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-384",
      },
      true,
      ["sign", "verify"],
    );

    const privateKey = await crypto.subtle.exportKey(
      "pkcs8",
      keyPair.privateKey,
    );
    const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);

    const keys = {
      private: encodeBase64(new Uint8Array(privateKey)),
      public: encodeBase64(new Uint8Array(publicKey)),
    };

    const data = new TextEncoder().encode(hash);
    const signatureBuff = await crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: "SHA-256",
      },
      keyPair.privateKey,
      data,
    );
    const signature = encodeBase64(new Uint8Array(signatureBuff));
    return {
      signature,
      publicKey: keys.public,
    };
  };

  const makeWacz = async (warcInput, cdxInput, pageInfo, recordDigest) => {
    const cdxInfo = JSON.parse(cdxInput);

    const index_input = `${cdxInfo.urlkey} ${cdxInfo.timestamp} {\"url\":\"${cdxInfo.url}\",\"digest\":\"sha256:${cdxInfo.digest}\",\"mime\":\"text/html\",\"offset\":${cdxInfo.offset},\"length\":${cdxInfo.length},\"recordDigest\":\"sha256:${recordDigest}\",\"status\":200,\"filename\":\"data.warc\"}`;

    const index_arch = {
      name: "indexes/index.cdx",
      lastModified: new Date(),
      input: index_input,
    };

    const index_hash = await sha256(index_input);

    const pages_input = `{\"format\":\"json-pages-1.0\",\"id\":\"pages\",\"title\":\"All Pages\"}\n{\"url\":\"${cdxInfo.url}\", \"id\":\"12345\", \"size\":${cdxInfo.length}, \"ts\":\"${new Date(Date.parse(pageInfo.date)).toISOString()}\", \"title\":\"${pageInfo.title}\"}`;

    const pages_arch = {
      name: "pages/pages.jsonl",
      lastModified: new Date(),
      input: pages_input,
    };

    const pages_hash = await sha256(pages_input);

    const archive_arch = {
      name: "archive/data.warc",
      lastModified: new Date(),
      input: warcInput,
    };

    const archive_buf = new Uint8Array(await warcInput.arrayBuffer());

    const archive_hash = await sha256(archive_buf);

    const datapackage_input = {
      profile: "data-package",
      resources: [
        {
          name: "pages.jsonl",
          path: "pages/pages.jsonl",
          hash: `sha256:${pages_hash}`,
          bytes: new TextEncoder().encode(pages_input).length,
        },
        {
          name: "data.warc",
          path: "archive/data.warc",
          hash: `sha256:${archive_hash}`,
          bytes: warcInput.size,
        },
        {
          name: "index.cdx",
          path: "indexes/index.cdx",
          hash: `sha256:${index_hash}`,
          bytes: new TextEncoder().encode(index_input).length,
        },
      ],
      wacz_version: "1.1.1",
      software:
        "InVID WeVerify plugin singlefile archiver with warcio.js 2.4.2",
      created: `${new Date(Date.now()).toISOString()}`,
      title: "singlefile2wacz.wacz",
    };
    const datapackage_arch = {
      name: "datapackage.json",
      lastModified: new Date(),
      input: JSON.stringify(datapackage_input, null, 2),
    };
    const datapackage_hash = await sha256(
      JSON.stringify(datapackage_input, null, 2),
    );

    // For anonymous signing
    // const signature = await sign(datapackage_hash);
    try {
      const tstsign = await domainCertSign(datapackage_hash);
      const cleanCert = tstsign.domainCert.replace("\n", "");
      // console.log(cleanCert)
      const cleantsCerts = tstsign.certs.join().replace("\n", "");
      // console.log(cleantsCerts)
      const signedData = {
        hash: `sha256:${datapackage_hash}`,
        created: new Date(Date.now()).toISOString(),
        software:
          "InVID WeVerify plugin singlefile archiver with warcio.js 2.4.2",
        signature: tstsign.signature,
        domain: "signature.verification-plugin.eu",
        domainCert: cleanCert,
        timeSignature: tstsign.encodedTST,
        timestampCert: cleantsCerts,
        version: "0.1.0",
      };

      const datapackagedigest_input = {
        path: "datapackage.json",
        hash: `sha256:${datapackage_hash}`,
        signedData: signedData,
        // signedData: {
        //   hash: `sha256:${datapackage_hash}`,
        //   signature: signature.signature,
        //   publicKey: signature.publicKey,
        //   created: new Date(Date.now()).toISOString(),
        //   software:
        //     "InVID WeVerify plugin singlefile archiver with warcio.js 2.4.2",
        // },
      };

      const datapackagedigest_arch = {
        name: "datapackage-digest.json",
        lastModified: new Date(),
        input: JSON.stringify(datapackagedigest_input, null, 2),
      };

      const zip = await downloadZip([
        datapackage_arch,
        datapackagedigest_arch,
        index_arch,
        pages_arch,
        archive_arch,
      ])
        .blob()
        .then((res) => {
          const blobUrl = URL.createObjectURL(res);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = `singlefile2wacz.wacz`;
          a.click();
        });
    } catch (error) {
      setError("Error signing WACZ, please try again");
      console.error(error);
    }
  };

  const singlefile2wacz = async (file2convert) => {
    setError("");
    const reader = new FileReader();
    reader.onload = async () => {
      const pageIntro = reader.result.slice(0, 500).split("\n"); //TODO: find better way of getting to the saved by singlefile comment
      const pageDate = pageIntro[3].slice(12);
      const pageURL = pageIntro[2].slice(5);
      const pageDateISO = new Date(Date.parse(pageDate)).toISOString();
      const getTitle = () => {
        for (const l of reader.result.split("/n")) {
          if (l.includes("<title>")) {
            const ret = l.match("<title>(.)*</title>")[0].slice(7, -8);
            const retbytes = new TextEncoder().encode(ret);
            return new TextDecoder("utf-8").decode(retbytes);
          }
        }
        return pageURL;
      };
      const pageInfo = {
        url: pageURL,
        date: pageDateISO,
        title: getTitle(),
      };
      await warcCreator(reader.result, pageURL, pageDateISO).then(
        async (res) => {
          let tmp = new Uint8Array(res[0].byteLength + res[1].byteLength);
          tmp.set(new Uint8Array(res[0]), 0);
          tmp.set(new Uint8Array(res[1]), res[0].byteLength);
          const recordDigest = await sha256(res[1]);
          const blob = new Blob([tmp.buffer], {
            type: "application/octet-stream",
          });

          const decoder = new TextDecoder("utf-8");
          const queuingStrategy = new CountQueuingStrategy({
            highWaterMark: 1,
          });
          const writableStream = new WritableStream(
            {
              write(chunk) {
                return new Promise((resolve, reject) => {
                  makeWacz(blob, chunk, pageInfo, recordDigest);
                  resolve();
                });
              },
              close() {},
              abort(err) {
                console.error("Sink error:", err);
              },
            },
            queuingStrategy,
          );

          const realIndexer = new CDXIndexer();

          await realIndexer.writeAll(
            [{ filename: "data.warc", reader: blob.stream(1024 * 128) }],
            writableStream.getWriter(),
          ); //Buffer size chosen based on warcio implementation
        },
      );
    };
    reader.readAsText(file2convert, "utf-8");
  };

  const warcCreator = async (fileContent, pageUrl, pageDate) => {
    const warcVersion = "WARC/1.1";

    const info = {
      software:
        "InVID WeVerify plugin singlefile archiver with warcio.js 2.4.2",
      format: "WARC File Format 1.1",
      isPartOf: "singlefile2wacz.wacz",
    };
    const filename = "singlefile2wacz.wacz#/archive/data.warc";

    const warcinfo = await WARCRecord.createWARCInfo(
      { filename, warcVersion },
      info,
    );

    const serializedWARCInfo = await WARCSerializer.serialize(warcinfo);

    // Create a sample response
    const url = pageUrl;
    const date = pageDate;
    const type = "response";
    const httpHeaders = {
      "Content-Type": 'text/html; charset="UTF-8"',
    };

    async function* content() {
      yield new TextEncoder().encode(fileContent);
    }

    const record = await WARCRecord.create(
      { url, date, type, warcVersion, httpHeaders },
      content(),
    );

    const serializedRecord = await WARCSerializer.serialize(record);

    return [serializedWARCInfo, serializedRecord];
  };

  return (
    <div>
      <ButtonGroup variant="outlined">
        <Button startIcon={<FolderOpenIcon />} sx={{ textTransform: "none" }}>
          <label htmlFor="file">
            {fileInput ? fileInput.name : "Upload the SingleFile page"}
            {/* {fileInput ? fileInput.name : keyword("archive_wacz_accordion")} */}
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept={".html"}
            hidden={true}
            onChange={(e) => {
              e.preventDefault();
              setFileInput(e.target.files[0]);
              e.target.value = null;
            }}
          />
        </Button>
        {fileInput instanceof Blob && (
          <Stack>
            <Button
              size="small"
              aria-label="remove selected file"
              onClick={(e) => {
                e.preventDefault();
                setFileInput(null);
              }}
            >
              <CloseIcon fontSize="small" />
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                singlefile2wacz(fileInput);
              }}
            >
              <label>Convert {/*{keyword("archive_wacz_accordion")} */}</label>
            </Button>
          </Stack>
        )}
      </ButtonGroup>
      <Typography color={"error"}>{error}</Typography>
    </div>
  );
};

export default SinglefileConverter;
