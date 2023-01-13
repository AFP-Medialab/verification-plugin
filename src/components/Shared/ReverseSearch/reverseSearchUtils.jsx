import { Timeout } from "../Utils/URLUtils";

export const loadImageContent(src, reverseSearchFunction) => {
    let img = FileReader()
    img.onload = () => {
        fileReader.readAsDataURL(fileObject);
    }
}

export const loadImage = (src, reverseSearchFunction) => {
   // window.body.style.cursor='wait';
   if (document !== undefined) 
        document.body.style.cursor='wait';
    let img = new Image();
    img.crossOrigin="anonymous"
    img.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);

        // Get raw image data
        reverseSearchFunction(canvas.toDataURL('image/png'));
        canvas.remove();
    };
    img.onerror = (error) => {
        console.log("failed to load image")
        if (document !== undefined) {
            document.body.style.cursor='default'
    };
    img.src = src;
}

export const localImageBaiduSearch = (content) => {
    let url = "https://graph.baidu.com/upload"
    const blob = b64toBlob(content, 'image/png')
    const data = new FormData();
    data.append('tn', 'pc');
    data.append('from', 'pc');
    data.append('range', '{"page_from": "searchIndex"}');
    data.append("image", blob)
    data.append('image_source', 'PC_UPLOAD_SEARCH_FILE');
    fetch(url, {
        mode: 'cors',
        method: 'POST',
        body: data
      }).then(response => {
        return response.json()})
    .then( json => {
        let tabUrl = json.data.url
        window.open(tabUrl, "_blank");
    })
    .finally(() => {document.body.style.cursor='default'})
}

export const localImageGoogleLens = (content) => {
    const blob = b64toBlob(content, 'image/png')
    let url = `https://lens.google.com/upload?ep=ccm&s=&st=${Date.now()}`
    const formData  = new FormData();
    formData.append("encoded_image", blob)
    fetch(url, {
        referrer: '',
        mode: 'cors',
        method: 'POST',
        body: formData
    }).then(response => {
        return response.text()
    }).then(body => {
        const tabUrl = body.match(/<meta .*URL=(https?:\/\/.*)"/)[1];
        window.open(tabUrl, "_blank");
    })
    .catch(error => {
      console.error(error)
    })
    .finally(() => {document.body.style.cursor='default'})
}

export const localImageYandexSearch = (content) => {
    let url = 'https://yandex.com/images/touch/search?rpt=imageview&format=json&request={"blocks":[{"block":"cbir-uploader__get-cbir-id"}]}'
    const blob = b64toBlob(content, 'image/png')
    const formData  = new FormData();
    formData.append("upfile", blob)
    fetch(url, {
        method: 'POST',
        headers : {
            "X-Requested-With" : "XMLHttpRequest",
            "Accept" : "application/json, text/javascript, */*; q=0.01"
        },
        body: formData
    }).then(response => {
        return response.json()
    }).then( json => {
        //console.log("response ", json)
        let block = json.blocks[0]
        //console.log("block ", block)
        let originalImageUrl = block.params.originalImageUrl
        //console.log("originalImageUrl : ", originalImageUrl)
        let cbirId = block.params.url
        let fullUrl = `https://yandex.com/images/search?rpt=imageview&url=${originalImageUrl}&${cbirId}`
        //console.log("full url  ", fullUrl)
        window.open(fullUrl, "_blank");
    })
    .catch(error => {
      console.error(error)
    })
    .finally(() => {document.body.style.cursor='default'})
}

export const localImageGoogleSearch = (content) => {
    const chromeSbiSrc = 'Google Chrome 107.0.5304.107 (Official) Windows';
    const blob = b64toBlob(content, 'image/png')
    let url = "https://www.google.com/searchbyimage/upload"
    const formData  = new FormData();
    formData.append("encoded_image", blob)
    formData.append('image_url', '');
    formData.append('sbisrc', chromeSbiSrc)
    fetch(url, {
        referrer: '',
        mode: 'cors',
        method: 'POST',
        body: formData,
        signal: Timeout(10).signal
    }).then(response => {
        window.open(response.url, "_blank");
    })
    .catch(error => {
      console.error(error)
       //try google lens
      localImageGoogleLens(content)
    })
    .finally(() => {document.body.style.cursor='default'})
}

export const localImageBingSearch = (content) => {
    let image = content.substring(content.indexOf(',') + 1)
    let url = "https://www.bing.com/images/search?view=detailv2&iss=sbiupload&FORM=SBIHMP&sbifnm=weverify-local-file"
    const formData  = new FormData()
    formData.append("data-imgurl", "")
    formData.append("cbir", "sbi")
    formData.append("imageBin", image)
    fetch(url, {
      
        method: 'POST',
        body: formData
    }).then(response => {
        //console.log("response ", response)
        window.open(response.url, "_blank");
    })
    .catch(error => {
      console.error(error)
    })
    .finally(() => {document.body.style.cursor='default'})
}


export const b64toBlob = (content, contentType='', sliceSize=512) => {
    let image = content.substring(content.indexOf(',') + 1)
    const byteCharacters = atob(image);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

