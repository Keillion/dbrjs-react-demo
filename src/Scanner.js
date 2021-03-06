import React from 'react';
import { Icon, Spin, message, Select } from 'antd';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Layout.css';
import { settingsFromPage } from './SettingPage';
// import Canvas from './canvas';

class EachResult extends React.Component {
    copyScannerResult = e => {
        const kUtil = window.kUtil;
        // kUtil.copyToClipBoard(this.props.content);
        kUtil.copyToClipBoard(e.target.innerText);
        var config = {};
        config.content = "copied successfully!";
        config.icon = <Icon type="copy" style={{ color: "#FE8E14" }}></Icon>;
        message.config({
            top: window.innerHeight - 180,
            duration: 1.5,
        });
        message.open(config);
    }


    render() {
        let txt = this.props.content;
        let possibleLink = txt;
        if (!txt.startsWith('http') && (txt.startsWith('www') || -1 !== txt.indexOf('.com') ||
            -1 !== txt.indexOf('.net') || -1 !== txt.indexOf('.org') || -1 !== txt.indexOf('.edu'))) {
            possibleLink = 'http://' + txt;
        }
        let isLink = possibleLink.startsWith('http');
        return (
            <div className="result-content">
                <>
                    <><span style={{ color: "#FE8E14" }}>{this.props.format}: </span></>
                    {
                        isLink ?
                            <a href={possibleLink} target={"_blank"} style={{ textDecoration: "underline" }} >{this.props.content}</a>
                            : <span onClick={this.copyScannerResult} style={{ fontSize: 16 }}>{this.props.content}</span>
                    }
                    {/* <><span style={{color:"#FE8E14"}}> x {this.props.count}</span></> */}
                    <><span style={{ color: "#FE8E14" }}></span></>
                    {/* <Button type="link" icon="copy" size="small" style={{float:"right"}}  onClick={this.copyScannerResult.bind(this)}></Button> */}
                </>
            </div>
        )
    }
}


class Result extends React.Component {
    render() {
        const resultItems = this.props.resultsInfo.slice(-3).map((ri, index) =>
            <EachResult key={index} content={ri.result !== undefined ? ri.result.BarcodeText : ri.BarcodeText}
                count={ri.count}
                format={ri.result !== undefined ? ri.result.BarcodeFormatString : ri.BarcodeFormatString}>
            </EachResult>
        );

        return (
            <div className="result-container">
                {resultItems}
            </div>
        )
    }
}


// const Dynamsoft = window.Dynamsoft;
var Dynamsoft;
let scanner = null;


class Scanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            resultsInfo: [],
            isOpen: false,
            resultsPoint: [],
            // camera:0,
            cameraList: [],
            isFullRegion: this.props.isFullRegion,
            // resolution:settingsFromPage.resolution,
            // barcodeFormat:settingsFromPage.barcodeformat,
            // localization:settingsFromPage.localization,
            // deblurLevel:settingsFromPage.deblurlevel,
            ...settingsFromPage,
            cameraOptions: null,
            bOpenTorch: false
        });
        this.video = React.createRef();

    }
    // onResize = () => this.forceUpdate()

    async showScanner() {
        var updateFrame = () => {
            var regionScale = 1.0 * this.props.region / 100;
            var regionWidth = regionScale * window.innerWidth;
            var regionHeight = 0.5 * regionScale * window.innerHeight;
            var r = this.state.resolution;
            var vW = r[0];
            var vH = r[1];
            var left, right, top, bottom;
            regionHeight = regionHeight >= 250 ? 250 : regionHeight;
            regionWidth = regionWidth >= 250 ? 250 : regionHeight;
            // console.log(r);
            left = (vW - regionWidth) / 2 / vW;
            right = (vW + regionWidth) / 2 / vW;
            top = (vH - regionHeight) / 2 / vH;
            bottom = (vH + regionHeight) / 2 / vH;
            // if(vW>=window.innerWidth){      //resolution > screen width, mainly mobiles
            //     if(regionWidth>=250){
            //         left = (window.innerWidth-regionWidth)/2/vW;
            //         right = (window.innerWidth+regionWidth)/2/vW;
            //         top = (vH-250)/2/vH;
            //         bottom = (vH+250)/2/vH;
            //     }
            //     else{
            //         left = (window.innerWidth-regionWidth)/2/vW;
            //         right = (window.innerWidth+regionWidth)/2/vW;
            //         top = (vH-regionHeight)/2/vH;
            //         bottom = (vH+regionHeight)/2/vH;
            //         //console.log(window.innerWidth,regionScale*window.innerWidth,regionWidth,left,right);
            //         // console.log("regionWidth<250 and vw>window.innerWidth");
            //     }
            // }

            // else if(vW<window.innerWidth){  //resolution > screen width, mainly pc
            //     if(regionWidth>=250){
            //         left = (vW-250)/2/vW;
            //         right = (vW+250)/2/vW;
            //         top = (vH-250)/2/vH;
            //         bottom = (vH+250)/2/vH;
            //         // console.log("regionWidth>250 and vw<window.innerWidth");
            //     }
            //     else {
            //         left = (vW-regionWidth)/2/vW;
            //         right = (vW + regionWidth)/2/vW;
            //         top = (vH-regionHeight)/2/vH;
            //         bottom = (vH+regionHeight)/2/vH;
            //     }

            //}

            scanner && scanner.getRuntimeSettings().then(settings => {
                if (!this.state.isFullRegion) {
                    if (this.state.usecase === 'VIN' || this.state.usecase === 'DLID') {
                        settings.region.regionLeft = Math.round(left * 100)+3;
                        settings.region.regionRight = Math.round(right * 100)-3;
                        settings.region.regionTop = Math.round(top * 100)-10;
                        settings.region.regionBottom = Math.round(bottom * 100)+10;
                        settings.region.regionMeasuredByPercentage = 1;
                    }else {
                        settings.region.regionLeft = Math.round(left * 100);
                        settings.region.regionRight = Math.round(right * 100);
                        settings.region.regionTop = Math.round(top * 100);
                        settings.region.regionBottom = Math.round(bottom * 100);
                        settings.region.regionMeasuredByPercentage = 1;
                    }
                }
                else {
                    settings.region.regionLeft = 0;
                    settings.region.regionRight = 100;
                    settings.region.regionTop = 0;
                    settings.region.regionBottom = 100;
                    settings.region.regionMeasuredByPercentage = 1;
                }
                // console.log(await scanner.getRuntimeSettings()) 
                // console.log(await scanner.getScanSettings())
                scanner.updateRuntimeSettings(settings);
            })

        };

        scanner = await Dynamsoft.BarcodeScanner.createInstance();
        scanner.setUIElement(document.getElementById("dbrScanner"));

        await scanner.updateVideoSettings({ video: { width: this.state.resolution[0], height: this.state.resolution[1], facingMode: "environment" } });
        let settings = await scanner.getRuntimeSettings();
        settings.barcodeFormatIds = this.state.barcodeFormat;
        settings.localizationModes = this.state.localization;
        settings.deblurLevel = this.state.deblurLevel;
        settings.scaleDownThreshold = this.state.scaleDownThreshold;
        settings.timeout = this.state.timeout;
        await scanner.updateRuntimeSettings(settings);
        updateFrame();      //needed here to update region area

        scanner.onFrameRead = (results) => {
            let resultPointsPerFrame = [];
            // let arrDiffCodeInfo = this.state.arrDiffCodeInfo;
            for (let i = 0; i < results.length; i++) {
                let result = results[i];
                resultPointsPerFrame.push(result.LocalizationResult.ResultPoints);

                for (let _result of this.state.resultsInfo) {
                    if (_result.barcodeText == result.barcodeText && _result.barcodeFormat == result.barcodeFormat) {
                        this.addLifeForResultInfo(_result);
                    }
                }
            }

            // let resultsInfo = scanner.arrDiffCodeInfo;
            this.setState({
                resultsPoint: resultPointsPerFrame,
                isFullRegion: this.props.isFullRegion,
            });
            scanner !== null && updateFrame();
        };

        scanner.onUnduplicatedRead = (txt, result) => {
            // remove info after 5s
            // scanner.pause();
            this.addLifeForResultInfo(result);

            // add info to show
            this.state.resultsInfo.push(result);
            this.setState({
                resultsInfo: this.state.resultsInfo
            });
        };



        try {
            await scanner.show();
            var bSupportTorch = scanner.getCapabilities().torch;
            // alert(bSupportTorch);
            var cameras = await scanner.getAllCameras();
            this.setState({
                bSupportTorch: bSupportTorch,
                resolution: scanner.getResolution(),
                cameraList: cameras,
                cameraOptions: cameras.map((cameraOption, index) =>
                    <Select.Option value={"camera:" + index} key={cameraOption.deviceId}>{cameraOption.label}</Select.Option>
                )
            });
            // console.log(scanner.getResolution());
            // console.log(scanner.getCompatibility());
            updateFrame();      //needed updateFrame here to get real resolution

        } catch (e) {
            console.log(e);
            var config = {};
            config.content = "Camera is unavailable.\n" + e;
            config.icon = <Icon type="frown" style={{ color: "#FE8E14" }}></Icon>;
            message.config({
                top: window.innerHeight / 2,
                duration: 5,
            });
            message.open(config);
        } finally {
            this.setState({
                isOpen: !this.state.isOpen
            });
        }
    }


    // restore 5s life to the result info
    addLifeForResultInfo = result => {
        // cancel remove task
        result.removeResultTimeoutId && clearTimeout(result.removeResultTimeoutId);
        // restore 5s life
        result.removeResultTimeoutId = setTimeout(() => {
            // remove result info
            let resultsInfo = this.state.resultsInfo;
            let pos = resultsInfo.indexOf(result);
            resultsInfo.splice(pos, 1);
            this.setState({
                resultsInfo: resultsInfo
            });
        }, 5000);
    }

    componentWillMount() {
        // window.addEventListener('resize', this.onResize);
        Dynamsoft = window.Dynamsoft;
        this.showScanner();
    }

    componentWillUnmount() {
        // window.removeEventListener('resize', this.onResize);
        (async function () {
            scanner.onFrameRead = false;
            scanner !== null && scanner.close();
            scanner !== null && await scanner.destroy();
            scanner = null;
        })()
    }

    handleFullRegion() {
        this.setState({
            isFullRegion: this.state.isFullRegion,
        })
    }

    async onSwitchCamera(value) {
        var infos = await scanner.getAllCameras();
        await scanner.setCurrentCamera(infos[value.split(":")[1]].deviceId);
        this.setState({
            camera: value.split(":")[1],
            resolution: scanner.getResolution()
        });


        var config = {};
        config.content = "Switch to " + infos[value.split(":")[1]].label + " successfully!";
        config.icon = <Icon type="smile" style={{ color: "#FE8E14" }}></Icon>;
        message.config({
            top: window.innerHeight - 180,
            duration: 1.5,
        });
        message.open(config);
    }

    async onFlashlightClick() {
        if (this.state.bOpenTorch)
            await scanner.turnOffTorch();
        else
            await scanner.turnOnTorch();
        this.setState({
            bOpenTorch: !this.state.bOpenTorch
        })
    }

    render() {
        var regionScale = 1.0 * this.props.region / 100;
        var regionHeight = 0.5 * regionScale * window.innerHeight;
        regionHeight = regionHeight >= 250 ? 250 : regionHeight;
        const flashlightTranslateY = regionHeight / 2 - 20;
        return (
            <>
                <style type="text/css">
                    {`
                .waiting{
                    position:absolute;
                    left:50%;
                    top:50%;
                    transform:translate(-50%);
                    color:#FE8E14;
                    transition: opacity 1000ms ease-in;
                }

                .fade-enter.fade-enter-active {
                    opacity:1;
                    transition: opacity 1000ms ease-in;
                }

                .fade-enter{
                    opacity:0;
                }

                .fade-leave{
                    opacity: 1; 
                }

                .fade-leave.fade-leave-active{
                    opacity:0;
                    transition: opacity 3000ms ease-in;
                }
                
                .fade-appear{
                    opacity:0;
                }

                .fade-appear.fade-appear-active {
                    opacity: 1;
                    transition: opacity 2000ms ease-in;
                }
                `}
                </style>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionLeave={true}
                    transitionAppear={false}
                    transitionEnter={false}
                    transitionAppearTimeout={500}
                    transitionLeaveTimeout={3500}
                    transitionEnterTimeout={2500}
                >
                    <div className='overlay' style={{ visibility: this.state.isOpen ? "hidden" : "visible" }}><Spin
                        className="waiting"
                        tip="Accessing Camera..."
                        indicator={<Icon type="video-camera" spin style={{ fontSize: "2.5rem" }}></Icon>}>
                    </Spin></div>

                </ReactCSSTransitionGroup>

                {/* <div id='scanner' style={{position:"absolute",width:"100%"}}>
                <div className="video-container">
                    <video style={{position:"absolute", left:"50%",top:"50%", transform:"translate(-50%,-50%)"}} className='dbrScanner-video custom-video' playsInline={true}></video>
                        <div style={{position:"absolute", left:"50%",top:"50%", transform:"translate(-50%,-50%)", width:this.state.resolution[0], height:this.state.resolution[1]}}>
                        {allCanvas}
                    </div>
                </div>
            </div> */}

                <div id='dbrScanner' style={{ width: "100%", height: "100%", minWidth: "100px", minHeight: "100px", background: "#eee", position: "relative", zIndex: "-1" }}>
                    <video className="dbrScanner-video" playsInline={true} style={{ width: "100%", height: "100%", position: "absolute", left: "0", top: "0", objectFit: "cover" }}></video>
                    <canvas className="dbrScanner-cvs-drawarea" style={{ width: "100%", height: "100%", position: "absolute", left: "0", top: "0"}}></canvas>
                </div>

                <Result resultsInfo={this.state.resultsInfo}></Result>
                {
                    this.state.cameraList.length > 0 &&
                    <Select onChange={this.onSwitchCamera.bind(this)}
                        style={{ position: "absolute", top: "60px", left: 0, width: "20%", maxWidth: 130, border: "0", color: "#FE8E14", opacity: "0.5" }}
                        defaultValue={"camera"}
                        // placeholder="camera"
                        suffixIcon={<Icon type="camera" style={{ color: "#FE8E14" }}></Icon>}
                        defaultActiveFirstOption={false}
                    >
                        {this.state.cameraOptions}
                    </Select>
                }
                {
                    this.state.bSupportTorch &&
                    <label onClick={this.onFlashlightClick.bind(this)} className="flashlight" style={{ transform: `translateY(${flashlightTranslateY}px)` }}>
                        <Icon type="funnel-plot" style={{ fontSize: "2rem", color: "#FE8E14" }}></Icon>
                    </label>
                }
            </>
        )
    }
}

export default Scanner;
export { Result, EachResult };