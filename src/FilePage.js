import React from "react";
import { PageHeader, Upload, Icon, message, List, Typography } from "antd";
import "./FilePage.css";
import "./Layout.css";
import { settingsFromPage } from "./SettingPage";
import Canvas from './canvas';


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
}

// function beforeUpload(file) {
//     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//     if (!isJpgOrPng) {
//         message.error('You can only upload JPG/PNG file!');
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//         message.error('Image must smaller than 2MB!');
//     }
//     return isJpgOrPng && isLt2M;
// }

function isLink(possibleLink) {
    if (
        !possibleLink.startsWith("http") &&
        (possibleLink.startsWith("www") ||
            -1 !== possibleLink.indexOf(".com") ||
            -1 !== possibleLink.indexOf(".net") ||
            -1 !== possibleLink.indexOf(".org") ||
            -1 !== possibleLink.indexOf(".edu"))
    ) {
        return true;
    } else {
        return false;
    }
}

var Dynamsoft;
var reader = null;

class FilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFile: true,
            loading: false,
            resultsInfo: "",
            ...settingsFromPage,
            isloadingNewFile: false,
            resultPoints: []
        };
        this._image = React.createRef();
    }

    // force rerender when resizing to align result points to image.
    onResize = () => this.forceUpdate()

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        Dynamsoft = window.Dynamsoft;
        Dynamsoft.BarcodeReader.createInstance().then((r) => {
            reader = r;
        });
        //Avoid page dragging
        let noDragDoms = document.getElementsByClassName("no-drag");
        for (let i = 0; i < noDragDoms.length; i++) {
            noDragDoms[i].addEventListener(
                "touchmove",
                function (e) {
                    e.preventDefault();
                },
                { passive: false }
            );
        }
    }

    componentWillUnmount() {
        reader && reader.destroy();
        reader = null;
        window.removeEventListener('resize', this.onResize);
    }

    handleChange = (file) => {
        if (file) {
            getBase64(file, (imageUrl) =>
                this.setState({
                    imageUrl,
                    loading: false,
                    isloadingNewFile: true,
                })
            );
            this.decodeFile(file);
        }
    };

    onSelectNewFile() {
        this.setState({
            isloadingNewFile: false,
        });
    }

    async decodeFile(file) {
        var config = {};
        message.config({
            top: window.innerHeight / 2,
            duration: 2,
        });

        var settings = await reader.getRuntimeSettings();
        settings.resultCoordinateType = 2 //RCT_PERCENTAGE
        // settings.barcodeFormatIds=this.state.barcodeFormat;
        // settings.localizationModes=this.state.localization;
        // settings.deblurLevel = this.state.deblurLevel;
        // console.log(settings);
        await reader.updateRuntimeSettings(settings);

        reader
            .decode(file)
            .then((results) => {
                console.log(this._image)
                if (results.length > 0) {
                    console.log(results);
                    var txts = [];
                    let resultPointsPerFrame = [];
                    for (var i = 0; i < results.length; ++i) {
                        txts.push(results[i].BarcodeText);
                        resultPointsPerFrame.push(results[i].LocalizationResult.ResultPoints);
                    }
                    this.setState({
                        resultPoints: resultPointsPerFrame,
                        resultsInfo: results,
                    });

                    config.content = "Found " + results.length + (results.length == 1 ? " barcode!" : " barcodes!");
                    config.icon = (
                        <Icon type="check" style={{ color: "#FE8E14" }}></Icon>
                    );
                    message.open(config);
                } else {
                    config.content = "No barcodes found!";
                    config.icon = (
                        <Icon type="close" style={{ color: "#FE8E14" }}></Icon>
                    );
                    message.open(config);
                    this.setState({
                        resultsInfo: "",
                    });
                }
            })
            .catch((e) => {
                config.content = "Unsupported image file!";
                config.icon = (
                    <Icon type="frown" style={{ color: "#FE8E14" }}></Icon>
                );
                message.open(config);
                console.log(e);
            });
    }

    copyScannerResult = (e) => {
        const kUtil = window.kUtil;
        kUtil.copyToClipBoard(e.target.innerText);
        var config = {};
        config.content = "copied successfully!";
        config.icon = <Icon type="copy" style={{ color: "#FE8E14" }}></Icon>;
        message.config({
            top: window.innerHeight - 180,
            duration: 1.5,
        });
        message.open(config);
    };

    render() {
        const uploadButton = (
            <div className="custom-upload-box">
                <Icon type={this.state.loading ? "loading" : "upload"} style={{
                    fontSize: '43px'
                }} />
                <div className="ant-upload-text">Upload Image</div>
            </div>
        );
        const { imageUrl } = this.state;

        if (this._image.current) {
            // console.log(this._image.current.width + " x " + this._image.current.height)
            // console.log(this.state.resultsInfo)
        }

        return (
            <>
                {/* show the file page */}
                <div className="file-container no-drag">
                    <PageHeader onBack={this.props.onBackClick} title="Files" />
                </div>

                <div className="upload-container no-drag">
                    <div
                        className="upload"
                        onClick={this.onSelectNewFile.bind(this)}
                    >
                        <div className="upload-bg">
                            <div className="upload-box">
                                {this.state.isloadingNewFile && imageUrl ? <img className='uploadedImg' ref={this._image} src={imageUrl} /> : uploadButton}
                                {/* TODO: calculation issue on mobile related to SDK */}
                                {this._image.current && this.state.resultsInfo.length > 0 && <div className='dataWrapper' style={{ width: this._image.current.width, height: this._image.current.height }} >
                                {this._image.current && this.state.resultPoints.map((eachResult, index) =>
                                    <Canvas key={index} point={eachResult}></Canvas>)} 
                                    </div> }
                            </div>
                        </div>
                        <label id="upload-label" htmlFor="input"></label>
                        <input
                            type="file"
                            id="input"
                            hidden
                            accept="image/png, image/jpeg, image/gif"
                            onChange={
                                (e) => this.handleChange(e.target.files[0])
                            }
                            onClick={
                                (e) => e.target.value = null
                            } >
                        </input>
                    </div>
                </div>

                {
                    <List
                        // header={<div>Scanning Result</div>}
                        className="decodefile-result-list"
                        dataSource={this.state.resultsInfo}
                        bordered
                        size="small"
                        style={{ visibility: (this.state.resultsInfo.length && this._image.current) ? "visible" : "hidden" }}
                        renderItem={(Item) => (
                            <List.Item style={{ display: "list-item" }}>
                                <Typography.Text>
                                    <span style={{ color: "#FE8E14" }}>
                                        {[Item.BarcodeFormatString]}:{" "}
                                    </span>
                                </Typography.Text>
                                {isLink(Item.BarcodeText) ? (
                                    <a
                                        href={"http://" + Item.BarcodeText}
                                        target={"_blank"}
                                        style={{ textDecoration: "underline" }}
                                    >
                                        {Item.BarcodeText}
                                    </a>
                                ) : (
                                        <span
                                            onClick={this.copyScannerResult}
                                            style={{ fontSize: 16 }}
                                        >
                                            {Item.BarcodeText}
                                        </span>
                                    )}
                            </List.Item>
                        )}
                    ></List>
                }
            </>
        );
    }
}

export default FilePage;
