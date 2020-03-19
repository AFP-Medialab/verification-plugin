import {Paper} from "@material-ui/core";
import {useDispatch} from "react-redux";
import React from "react";
import Typography from "@material-ui/core/Typography";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import MapIcon from '@material-ui/icons/Map';
import Tooltip from "@material-ui/core/Tooltip";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import {cleanMetadataState} from "../../../../../redux/actions/tools/metadataActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Metadata.tsv";

const MetadataImageResult = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Metadata.tsv", tsv);

    const report = props["result"];
    const dispatch = useDispatch();
    if (report.message === "metadata_img_error_exif")
        return (
            <Paper className={classes.root}>
                <CloseResult onClick={() => dispatch(cleanMetadataState())}/>
                <img src={props.image} alt={props.image}/>
                <Typography variant={"h5"}>
                    {keyword("metadata_img_error_exif")}
                </Typography>
            </Paper>
        );

    let softwareInfos = [
        {
            title: keyword("metadata_img_software_fields_1"),
            value: report.Make,
            description: keyword("metadata_img_software_desc_1")
        },
        {
            title: keyword("metadata_img_software_fields_2"),
            value: report.Model,
            description: keyword("metadata_img_software_desc_2")
        },
        {
            title: keyword("metadata_img_software_fields_3"),
            value: report.Orientation,
            description: keyword("metadata_img_software_desc_3")
        },
        {
            title: keyword("metadata_img_software_fields_4"),
            value: (report.XResolution) ? report.XResolution.numerator / report.XResolution.denominator : null,
            description: keyword("metadata_img_software_desc_4")
        },
        {
            title: keyword("metadata_img_software_fields_5"),
            value: (report.YResolution) ? report.YResolution.numerator / report.YResolution.denominator : null,
            description: keyword("metadata_img_software_desc_5")
        },
        {
            title: keyword("metadata_img_software_fields_6"),
            value: report.ResolutionUnit,
            description: keyword("metadata_img_software_desc_6")
        },
        {
            title: keyword("metadata_img_software_fields_7"),
            value: report.HostComputer,
            description: keyword("metadata_img_software_desc_7")
        },
        {
            title: keyword("metadata_img_software_fields_8"),
            value: report.Software,
            description: keyword("metadata_img_software_desc_8")
        },
        {
            title: keyword("metadata_img_software_fields_9"),
            value: report.DateTime,
            description: keyword("metadata_img_software_desc_9")
        },
        {
            title: keyword("metadata_img_software_fields_10"),
            value: (report.YCbCrPositioning) ? ((report.YCbCrPositioning === 1) ? "Centered (add tsv)" : "Co-sited (add tsv)") : null,
            description: keyword("metadata_img_software_desc_10")
        },
        {
            title: keyword("metadata_img_software_fields_11"),
            value: report.Copyright,
            description: keyword("metadata_img_software_desc_11")
        },
    ];

    let exifInfos = [
        {
            title: keyword("metadata_img_general_fields_1"),
            value: report.Artist,
            description: keyword("metadata_img_general_desc_1")
        },
        {
            title: keyword("metadata_img_general_fields_2"),
            value: report.DocumentName,
            description: keyword("metadata_img_general_desc_2")
        },
        {
            title: keyword("metadata_img_general_fields_3"),
            value: report.PageName,
            description: keyword("metadata_img_general_desc_3")
        },
        {
            title: keyword("metadata_img_general_fields_4"),
            value: (report.ExposureTime) ? report.ExposureTime.numerator / report.ExposureTime.denominator : null,
            description: keyword("metadata_img_general_desc_4")
        },
        {
            title: keyword("metadata_img_general_fields_5"),
            value: (report.FNumber) ? report.FNumber.numerator / report.FNumber.denominator : null,
            description: keyword("metadata_img_general_desc_5")
        },
        {
            title: keyword("metadata_img_general_fields_6"),
            value: report.ExposureProgram,
            description: keyword("metadata_img_general_desc_6")
        },
        {
            title: keyword("metadata_img_general_fields_7"),
            value: report.ExifVersion,
            description: keyword("metadata_img_general_desc_7")
        },
        {
            title: keyword("metadata_img_general_fields_8"),
            value: report.DateTimeOriginal,
            description: keyword("metadata_img_general_desc_8")
        },
        {
            title: keyword("metadata_img_general_fields_9"),
            value: report.DateTimeDigitized,
            description: keyword("metadata_img_general_desc_9")
        },
        {
            title: keyword("metadata_img_general_fields_10"),
            value: report.ComponentsConfiguration,
            description: keyword("metadata_img_general_desc_10")
        },
        {
            title: keyword("metadata_img_general_fields_11"),
            value: (report.CompressedBitsPerPixel) ? report.CompressedBitsPerPixel.numerator / report.CompressedBitsPerPixel.denominator : null,
            description: keyword("metadata_img_general_desc_11")
        },
        {
            title: keyword("metadata_img_general_fields_12"),
            value: report.ExposureBias,
            description: keyword("metadata_img_general_desc_12")
        },
        {
            title: keyword("metadata_img_general_fields_13"),
            value: (report.MaxApertureValue) ? report.MaxApertureValue.numerator / report.MaxApertureValue.denominator : null,
            description: keyword("metadata_img_general_desc_13")
        },
        {
            title: keyword("metadata_img_general_fields_14"),
            value: report.MeteringMode,
            description: keyword("metadata_img_general_desc_14")
        },
        {
            title: keyword("metadata_img_general_fields_15"),
            value: report.Flash,
            description: keyword("metadata_img_general_desc_15")
        },
        {
            title: keyword("metadata_img_general_fields_16"),
            value: (report.FocalLength) ? report.FocalLength.numerator / report.FocalLength.denominator : null,
            description: keyword("metadata_img_general_desc_16")
        },
        {
            title: keyword("metadata_img_general_fields_17"),
            value: report.UserComment,
            description: keyword("metadata_img_general_desc_17")
        },
        {
            title: keyword("metadata_img_general_fields_18"),
            value: report.ImageDescription,
            description: keyword("metadata_img_general_desc_18")
        },
        {
            title: keyword("metadata_img_general_fields_19"),
            value: (report.MakerNoteSafety) ? ((report.MakerNoteSafety === 1) ? "Safe (add tsv" : "Unsafe (add tsv)") : null,
            description: keyword("metadata_img_general_desc_19")
        },
        {
            title: keyword("metadata_img_general_fields_20"),
            value: report.SubjectDistanceRange,
            description: keyword("metadata_img_general_desc_20")
        },
        {
            title: keyword("metadata_img_general_fields_21"),
            value: report.FlashpixVersion,
            description: keyword("metadata_img_general_desc_23")
        },
        {
            title: keyword("metadata_img_general_fields_22"),
            value: report.ColorSpace,
            description: keyword("metadata_img_general_desc_22")
        },
        {
            title: keyword("metadata_img_general_fields_23"),
            value: report.ExifImageWidth,
            description: keyword("metadata_img_general_desc_23")
        },
        {
            title: keyword("metadata_img_general_fields_24"),
            value: report.ExifImageHeight,
            description: keyword("metadata_img_general_desc_24")
        },
        {
            title: keyword("metadata_img_general_fields_25"),
            value: report.FileSource,
            description: keyword("metadata_img_general_desc_25")
        },
    ];

    const convertDMSToDD = (GPStitude, direction) => {
        if (!GPStitude || !direction)
            return null;

        let dd = GPStitude[0] + (GPStitude[1] / 60) + (GPStitude[2] / 3600);

        if (direction === "S" || direction === "W") {
            dd = dd * -1;
        }

        return dd;
    };

    const getGoogleMapsLink = (latitue, latitudeRef, longitude, longitudeRef) => {
        let url = "https://www.google.com/maps/place/" //38%C2%B054'35.4%22N+1%C2%B026'19.2%22E/
        let lat = latitue[0] + "%C2%B0" + latitue[1] + "'" + latitue[2] + "%22" + latitudeRef;
        let long = longitude[0] + "%C2%B0" + longitude[1] + "'" + longitude[2] + "%22" + longitudeRef;
        return url + lat + "+" + long
    };


    let gpsInfo = [
        {
            title: keyword("metadata_img_gps_fields_1"),
            value: report.GPSLatitudeRef,
            description: keyword("metadata_img_gps_desc_1")
        },
        {
            title: keyword("metadata_img_gps_fields_2"),
            value: convertDMSToDD(report.GPSLatitude, report.GPSLatitudeRef),
            description: keyword("metadata_img_gps_desc_2")
        },
        {
            title: keyword("metadata_img_gps_fields_3"),
            value: report.GPSLongitudeRef,
            description: keyword("metadata_img_gps_desc_3")
        },
        {
            title: keyword("metadata_img_gps_fields_4"),
            value: convertDMSToDD(report.GPSLongitude, report.GPSLongitudeRef),
            description: keyword("metadata_img_gps_desc_4")
        },
        {
            title: keyword("metadata_img_gps_fields_5"),
            value: (report.GPSTimeStamp) ? report.GPSTimeStamp[0] + ":" + report.GPSTimeStamp[1] + ":" + report.GPSTimeStamp[2] : null,
            description: keyword("metadata_img_gps_desc_5")
        },
    ];


    return (
        <Paper className={classes.root}>
            <CloseResult onClick={() => dispatch(cleanMetadataState())}/>
            <img src={props.image} alt={props.image}/>
            <Typography variant={"h5"}>
                {keyword("metadata_img_software_title")}
            </Typography>
            <div>
                <Table size="small" aria-label="a dense table">
                    <TableBody>
                        {
                            softwareInfos.map((value, key) => {
                                if (value.value)
                                    return (
                                        <TableRow key={key}>
                                            <Tooltip title={value.description} placement="right">
                                                <TableCell component="th" scope="row">
                                                    {value.title}
                                                </TableCell>
                                            </Tooltip>
                                            <TableCell align="right">{value.value}</TableCell>
                                        </TableRow>
                                    );
                                return null;
                            })
                        }
                    </TableBody>
                </Table>
            </div>
            <Box m={3}/>
            <Typography variant={"h5"}>
                {keyword("metadata_img_general_title")}
            </Typography>
            <div>
                <Table size="small" aria-label="a dense table">
                    <TableBody>
                        {
                            exifInfos.map((value, key) => {
                                if (value.value)
                                    return (
                                        value.value &&
                                        <TableRow key={key}>
                                            <Tooltip title={value.description} placement="right">
                                                <TableCell component="th" scope="row">
                                                    {value.title}
                                                </TableCell>
                                            </Tooltip>
                                            <TableCell align="right">{value.value}</TableCell>
                                        </TableRow>
                                    );
                                return null;
                            })
                        }
                    </TableBody>
                </Table>
            </div>
            {
                report.GPSLatitudeRef &&
                <div>
                    <Box m={3}/>
                    <Typography variant={"h5"}>
                        {keyword("metadata_img_gps_title")}
                    </Typography>
                    <div>
                        <Table size="small" aria-label="a dense table">
                            <TableBody>
                                {
                                    gpsInfo.map((value, key) => {
                                        if (value.value)
                                            return (
                                                value.value &&
                                                <TableRow key={key}>
                                                    <Tooltip title={value.description} placement="right">
                                                        <TableCell component="th" scope="row">
                                                            {value.title}
                                                        </TableCell>
                                                    </Tooltip>
                                                    <TableCell align="right">{value.value}</TableCell>
                                                </TableRow>
                                            );
                                        return null;
                                    })
                                }
                            </TableBody>
                        </Table>
                    </div>
                    <Box m={2}/>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.open(getGoogleMapsLink(report.GPSLatitude, report.GPSLatitudeRef, report.GPSLongitude, report.GPSLongitudeRef), "_blank")}
                    >
                        <MapIcon/>
                        <Typography variant={"subtitle2"}>{keyword("metadata_gps_button")}</Typography>
                    </Button>
                </div>
            }
        </Paper>
    );
};
export default MetadataImageResult;