import {Paper} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";
import React from "react";
import Typography from "@material-ui/core/Typography";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import MapIcon from '@material-ui/icons/Map';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
}));


const MetadataImageResult = (result) => {
    const classes = useStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const report = result["result"];

    let softwareInfos = [
        {
            title: keyword("metadata_img_software_fields_1"),
            value: report.Make,
        },
        {
            title: keyword("metadata_img_software_fields_2"),
            value: report.Model,
        },
        {
            title: keyword("metadata_img_software_fields_3"),
            value: report.Orientation,
        },
        {
            title: keyword("metadata_img_software_fields_4"),
            value: (report.XResolution) ? report.XResolution.numerator / report.XResolution.denominator : null,
        },
        {
            title: keyword("metadata_img_software_fields_5"),
            value: (report.YResolution) ? report.YResolution.numerator / report.YResolution.denominator : null,
        },
        {
            title: keyword("metadata_img_software_fields_6"),
            value: report.ResolutionUnit,
        },

        {
            title: keyword("metadata_img_software_fields_7"),
            value: report.HostComputer,
        },
        {
            title: keyword("metadata_img_software_fields_8"),
            value: report.Software,
        },
        {
            title: keyword("metadata_img_software_fields_9"),
            value: report.DateTime,
        },
        {
            title: keyword("metadata_img_software_fields_10"),
            value: (report.YCbCrPositioning) ? ((report.YCbCrPositioning === 1) ? "Centered (add tsv)" : "Co-sited (add tsv)") : null,
        },
        {
            title: keyword("metadata_img_software_fields_11"),
            value: report.Copyright,
        },
    ];

    let exifInfos = [
        {
            title: keyword("metadata_img_general_fields_1"),
            value: report.Artist,
        },
        {
            title: keyword("metadata_img_general_fields_2"),
            value: report.DocumentName,
        },
        {
            title: keyword("metadata_img_general_fields_3"),
            value: report.PageName,
        },
        {
            title: keyword("metadata_img_general_fields_4"),
            value: (report.ExposureTime) ? report.ExposureTime.numerator / report.ExposureTime.denominator : null,
        },
        {
            title: keyword("metadata_img_general_fields_5"),
            value: (report.FNumber) ? report.FNumber.numerator / report.FNumber.denominator : null,
        },
        {
            title: keyword("metadata_img_general_fields_6"),
            value: report.ExposureProgram,
        },
        {
            title: keyword("metadata_img_general_fields_7"),
            value: report.ExifVersion,
        },
        {
            title: keyword("metadata_img_general_fields_8"),
            value: report.DateTimeOriginal,
        },
        {
            title: keyword("metadata_img_general_fields_9"),
            value: report.DateTimeDigitized,
        },
        {
            title: keyword("metadata_img_general_fields_10"),
            value: report.ComponentsConfiguration,
        },
        {
            title: keyword("metadata_img_general_fields_11"),
            value: (report.CompressedBitsPerPixel) ? report.CompressedBitsPerPixel.numerator / report.CompressedBitsPerPixel.denominator : null,
        },
        {
            title: keyword("metadata_img_general_fields_12"),
            value: report.ExposureBias,
        },
        {
            title: keyword("metadata_img_general_fields_13"),
            value: (report.MaxApertureValue) ? report.MaxApertureValue.numerator / report.MaxApertureValue.denominator : null,
        },
        {
            title: keyword("metadata_img_general_fields_14"),
            value: report.MeteringMode,
        },
        {
            title: keyword("metadata_img_general_fields_15"),
            value: report.Flash,
        },
        {
            title: keyword("metadata_img_general_fields_16"),
            value: (report.FocalLength) ? report.FocalLength.numerator / report.FocalLength.denominator : null,
        },
        {
            title: keyword("metadata_img_general_fields_17"),
            value: report.UserComment,
        },
        {
            title: keyword("metadata_img_general_fields_18"),
            value: report.ImageDescription,
        },
        {
            title: keyword("metadata_img_general_fields_19"),
            value: (report.MakerNoteSafety) ? ((report.MakerNoteSafety === 1) ? "Safe (add tsv" : "Unsafe (add tsv)") : null,
        },
        {
            title: keyword("metadata_img_general_fields_20"),
            value: report.SubjectDistanceRange,
        },
        {
            title: keyword("metadata_img_general_fields_21"),
            value: report.FlashpixVersion,
        },
        {
            title: keyword("metadata_img_general_fields_22"),
            value: report.ColorSpace,
        },
        {
            title: keyword("metadata_img_general_fields_23"),
            value: report.ExifImageWidth,
        },
        {
            title: keyword("metadata_img_general_fields_24"),
            value: report.ExifImageHeight,
        },
        {
            title: keyword("metadata_img_general_fields_25"),
            value: report.FileSource,
        },
    ];

    const convertDMSToDD = (GPStitude, direction) => {
        if (!GPStitude || !direction)
            return null;

        let dd = GPStitude[0] + (GPStitude[1] / 60) + (GPStitude[2] / 3600);

        if (direction == "S" || direction == "W") {
            dd = dd * -1;
        }

        return dd;
    };

    const getGoogleMapsLink = (latitue, latitudeRef, longitude, longitudeRef) => {
        let url = "https://www.google.com/maps/place/" //38%C2%B054'35.4%22N+1%C2%B026'19.2%22E/
        let lat =  latitue[0] + "%C2%B0" +  latitue[1] + "'" +  latitue[2] + "%22" + latitudeRef;
        let long =  longitude[0] + "%C2%B0" +  longitude[1] + "'" +  longitude[2] + "%22" + longitudeRef;
        return url + lat + "+" + long
    };


    let gpsInfo = [
        {
            title: keyword("metadata_img_gps_fields_1"),
            value: report.GPSLatitudeRef,
        },
        {
            title: keyword("metadata_img_gps_fields_2"),
            value: convertDMSToDD(report.GPSLatitude, report.GPSLatitudeRef),
        },
        {
            title: keyword("metadata_img_gps_fields_3"),
            value: report.GPSLongitudeRef,
        },
        {
            title: keyword("metadata_img_gps_fields_4"),
            value: convertDMSToDD(report.GPSLongitude, report.GPSLongitudeRef),
        },
        {
            title: keyword("metadata_img_gps_fields_5"),
            value: (report.GPSTimeStamp) ? report.GPSTimeStamp[0] + ":" + report.GPSTimeStamp[1] + ":" + report.GPSTimeStamp[2] : null,
        },
    ];

    return (
        <Paper className={classes.root}>
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
                                            <TableCell component="th" scope="row">
                                                {value.title}
                                            </TableCell>
                                            <TableCell align="right">{value.value}</TableCell>
                                        </TableRow>
                                    );
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
                                            <TableCell component="th" scope="row">
                                                {value.title}
                                            </TableCell>
                                            <TableCell align="right">{value.value}</TableCell>
                                        </TableRow>
                                    );
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
                                                    <TableCell component="th" scope="row">
                                                        {value.title}
                                                    </TableCell>
                                                    <TableCell align="right">{value.value}</TableCell>
                                                </TableRow>
                                            );
                                    })
                                }
                            </TableBody>
                        </Table>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={()=> window.open(getGoogleMapsLink(report.GPSLatitude, report.GPSLatitudeRef, report.GPSLongitude, report.GPSLongitudeRef), "_blank")}
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