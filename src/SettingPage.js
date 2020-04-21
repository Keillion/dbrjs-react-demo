import React from 'react';
import { PageHeader, Menu, Icon, Button, Radio, Card, Divider, Checkbox, Row, Col, message } from 'antd';
import './SettingPage.css';
import './Layout.css';


const { SubMenu } = Menu;

function CutOff() {
    return (
        <Divider style={{ margin: "10px 0" }} />
    )
}

const AttributeStyle = {
    padding: "5px"
};

const checkGroupStyle = {
    paddingLeft: "20px",
    color: "antiquewhite",
    width: '100%'
}

let settingsFromPage = {
    resolution: [1280, 720],
    barcodeFormat: undefined,
    localization: [2, 0, 0, 0, 0, 0, 0, 0],
    deblurlevel: 0,
    scaleDownThreshold: 2300,
    timeout: 10000,
};

// const options=['1D','PDF417','QR Code','Data Matrix','Aztec Code'];
var Dynamsoft = window.Dynamsoft;
var _1D = Dynamsoft.EnumBarcodeFormat.BF_ONED;
var _PDF417 = Dynamsoft.EnumBarcodeFormat.BF_PDF417;
var _QRCode = Dynamsoft.EnumBarcodeFormat.BF_QR_CODE;
var _DataMatrix = Dynamsoft.EnumBarcodeFormat.BF_DATAMATRIX;
var _AztecCode = Dynamsoft.EnumBarcodeFormat.BF_AZTEC;
var _MaxiCode = Dynamsoft.EnumBarcodeFormat.BF_MAXICODE;
var _GS1DataBar = Dynamsoft.EnumBarcodeFormat.BF_GS1_DATABAR;
var _GS1Composite = Dynamsoft.EnumBarcodeFormat.BF_GS1_COMPOSITE;
var _PatchCode = Dynamsoft.EnumBarcodeFormat.BF_PATCHCODE;

const default2DCheckList = ["PDF417", "QRCode", "DataMatrix", "AztecCode", "MaxiCode", "GS1DataBar", "GS1Composite", "PatchCode"];
if (!Dynamsoft.BarcodeReader._bUseFullFeature) {
    default2DCheckList.length = 3;
}

const allOneDOptions = ['CODE 39', 'CODE 128', 'CODE 93', 'CODABAR', 'ITF', 'EAN 13', 'EAN 8', 'UPC A', 'UPC E', 'Industrial 25', 'CODE 39 EXTENDED', 'GS1 Databar', 'Postal Code']
const allTwoDOptions = ['PDF 417', 'Micro PDF417', 'QR CODE', 'Micro QR', 'DataMatrix', 'Aztec Code', , 'Maxicode', 'Patch Code', 'GS1 COMPOSITE']
const TwoDcheckedList = ["PDF417", "QRCode", "DataMatrix"]
const formats = { "1D": _1D, "PDF417": _PDF417, "QRCode": _QRCode, "DataMatrix": _DataMatrix, "AztecCode": _AztecCode, "MaxiCode": _MaxiCode, "GS1DataBar": _GS1DataBar, "GS1Composite": _GS1Composite, "PatchCode": _PatchCode };
var _all = 0;
// defaultCheckList.forEach(item => { _all += formats[item] });
// settingsFromPage.barcodeFormat = _all;


class BarcodeFormat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: allOneDOptions,
            indeterminate: false,
            OneDcheckAll: true,
            TwoDcheckAll: false,
        }
    }

    onChange = checkedList => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < allOneDOptions.length,
            OneDcheckAll: checkedList.length === allOneDOptions.length,
            TwoDcheckAll: checkedList.length === allTwoDOptions.length,
        })
    }

    onOneDCheckAllChange = e => {
        this.setState({
            checkedList: e.target.checked ? allOneDOptions : [],
            indeterminate: false,
            OneDcheckAll: e.target.checked,
        });
    };

    onTwoDCheckAllChange = e => {
        this.setState({
            checkedList: e.target.checked ? allTwoDOptions : [],
            indeterminate: false,
            TwoDcheckAll: e.target.checked,
        });
    };

    onSelectFormat = e => {
        // console.log(e.target.format,e.target.value,this.state.checkedList.indexOf(e.target.value)!==-1);
        // this.state.checkedList.indexOf(e.target.value)!==-1?(settingsFromPage.barcodeFormat -= e.target.format):(settingsFromPage.barcodeFormat += e.target.format);
        this.state.checkedList.indexOf(e.target.value) !== -1 ? (settingsFromPage.barcodeFormat = settingsFromPage.barcodeFormat & (~e.target.format)) : (settingsFromPage.barcodeFormat = settingsFromPage.barcodeFormat | e.target.format);
    }

    onClickMoreFormat = () => {

        let locQuestion = window.location.href.lastIndexOf('?');
        let locHash = window.location.href.lastIndexOf('#');
        if (-1 === locQuestion) {
            if (-1 === locHash) {
                // no ?, no #
                window.location.href += "?full=true";
            } else {
                // have #
                window.location.href = window.location.href.substring(0, locQuestion) + "?full=true" + window.location.href.substring(locQuestion);
            }
        } else {
            // have ?
            window.location.href = window.location.href.substring(0, locQuestion + 1) + "full=true&" + window.location.href.substring(locQuestion + 1);
        }
    }

    render() {
        return (
            <Menu mode="inline">
                <SubMenu
                    key="format"
                    title={
                        <span>
                            <Icon type="barcode" />
                            <span>Barcode Format</span>
                        </span>
                    }
                >
                    <div>
                        <div className="site-checkbox-all-wrapper">
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onOneDCheckAllChange}
                                checked={this.state.OneDcheckAll}
                            >1D Barcodes</Checkbox>
                        </div>
                        <br />
                        <Checkbox.Group
                            value={this.state.checkedList}
                            onChange={this.onChange.bind(this)}
                            style={checkGroupStyle}
                        >
                            <Row>
                                {
                                    allOneDOptions.map((item, index) => {
                                        var key = item;
                                        return (<Col span={8} style={AttributeStyle} key={key + index}>
                                            <Checkbox value={key} format={formats[key]} onChange={this.onSelectFormat.bind(this)}>{key}</Checkbox>
                                        </Col>)
                                    })
                                }
                            </Row>
                        </Checkbox.Group>
                        <div className="site-checkbox-all-wrapper" style={{paddingTop: '20px'}}>
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onTwoDCheckAllChange}
                                checked={this.state.TwoDcheckAll}
                            >2D Barcodes</Checkbox>
                        </div>
                        <br />
                        <Checkbox.Group
                            value={this.state.TwoDcheckedList}
                            onChange={this.onChange.bind(this)}
                            style={checkGroupStyle}
                        >
                            <Row>
                                {
                                    default2DCheckList.map((item, index) => {
                                        var key = item;
                                        return (<Col span={8} style={AttributeStyle} key={key + index}>
                                            <Checkbox value={key} format={formats[key]} onChange={this.onSelectFormat.bind(this)}>{key}</Checkbox>
                                        </Col>)
                                    }
                                    )
                                }
                                <Col span={8} style={{ padding: "15px 0" }}>
                                    {
                                        !Dynamsoft.BarcodeReader._bUseFullFeature &&
                                        <Button icon="plus" type="primary" size="small" onClick={this.onClickMoreFormat.bind(this)}>More Formats</Button>
                                    }
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </div>
                </SubMenu>

            </Menu>

        )
    }
}


class ScanSettings extends React.Component {
    onSelectChange = e => {
        if (e.target.value === "accurate") {
            settingsFromPage.localization = [2, 16, 4, 8, 0, 0, 0, 0]
            settingsFromPage.deblurlevel = 5;
            settingsFromPage.expectedBarcodesCount = 512;
            settingsFromPage.scaleDownThreshold = 100000;
            settingsFromPage.timeout = 100000;
        } else if (e.target.value === "balance") {
            settingsFromPage.localization = [2, 16, 0, 0, 0, 0, 0, 0];
            settingsFromPage.deblurlevel = 3;
            settingsFromPage.expectedBarcodesCount = 512;
            settingsFromPage.scaleDownThreshold = 2300;
            settingsFromPage.timeout = 100000;
        } else { //speed
            settingsFromPage.localization = [2, 0, 0, 0, 0, 0, 0, 0];
            settingsFromPage.deblurlevel = 0;
            settingsFromPage.expectedBarcodesCount = 0;
            settingsFromPage.scaleDownThreshold = 2300;
            settingsFromPage.timeout = 10000;
        }
    };

    render() {
        return (
            <Menu mode="inline">
                <SubMenu
                    key="scan"
                    title={
                        <span>
                            <Icon type="setting"></Icon>
                            <span>Scan Settings</span>
                        </span>
                    }
                >
                    <Radio.Group style={{ paddingLeft: '20px', width: '100%' }} onChange={this.onSelectChange.bind(this)} defaultValue='fast'>
                        <Row>
                            <Col span={8}>
                                <Radio style={AttributeStyle} value="fast">Fastest</Radio>
                            </Col>
                            <Col span={8}>
                                <Radio style={AttributeStyle} value="balance">Balance</Radio>
                            </Col>
                            <Col span={8}>
                                <Radio style={AttributeStyle} value="accurate">Most Accurate</Radio>
                            </Col>
                        </Row>
                    </Radio.Group>
                </SubMenu > 
            </Menu >
            
        )
    }
}

// class ReadFullRegion extends React.Component{
//     constructor(props){
//         super(props);
//         this.state={
//             value:0
//         }
//     }

//     render(){
//         return(
//             <Menu mode="inline">
//                 <SubMenu 
//                     key="region" 
//                     title={
//                     <span>
//                         <Icon type="eye"></Icon>
//                         <span>Read Full Region</span>
//                     </span>
//                     }
//                 >
//                     <div>
//                         <Switch onChange={this.onChangeRegionMode} 
//                             style={{float:"right",right:"10px"}}/> 
//                     </div>
//                 </SubMenu>   
//             </Menu>

//         )
//     }
// }


class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        }
    }

    render() {
        return (
            <Menu mode="inline">
                <SubMenu
                    key="about"
                    title={
                        <span>
                            <Icon type="bulb"></Icon>
                            <span>About Dynamsoft</span>
                        </span>
                    }
                >
                    <div>
                        <Card title="About">
                            <p>
                                Founded in Sep 2003 with the aim of being the dynamic center of software developers,
                                Dynamsoft provides enterprise-class document capture and image processing software development kits (SDK),
                                with numerous generations for each product. Today many Fortune 500 Companies including HP, IBM, Intel, and Siemens trust Dynamsoft solutions.
                            </p>
                        </Card>
                    </div>
                </SubMenu>
            </Menu>
        )
    }
}


class ClearCache extends React.Component {
    handleClear() {
        var config = {};
        message.config({
            top: window.innerHeight / 2,
            duration: 2,
        });
        try {
            console.log(window.indexedDB);
            var request = window.indexedDB.deleteDatabase('dynamsoft');
            request.onsuccess = request.onerror = () => {
                if (request.error) {
                    // alert('Clear failed: '+(request.error.message || request.error));
                    config.content = 'Clear failed: ' + (request.error.message || request.error);
                    config.icon = <Icon type="close" style={{ color: "red" }}></Icon>;
                    message.open(config);
                } else {
                    // alert('Clear success!');
                    config.content = "Clear success!";
                    config.icon = <Icon type="check-circle" style={{ color: "#FE8E14" }}></Icon>;
                    message.open(config);
                }
            };
        } catch (ex) {
            //alert(ex.message || ex);
            config.content = ex.message || ex;
            config.icon = <Icon type="close" style={{ color: "red" }}></Icon>;
            message.open(config);
        }
    }

    render() {
        return (
            <div className="clear-cache">
                <Button type="primary"
                    size="large"
                    onClick={this.handleClear.bind(this)}
                    style={{ backgroundColor: "rgb(254, 142, 20)", border: "1px solid rgb(254, 142, 20)" }}
                >
                    Clear Cache
                </Button>
            </div>
        )
    }
}

class SettingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: true,
            selectedTags: [],
        }
    }


    render() {
        return (
            <>
                {/* hide the setting button if the  setting page is shown */}
                {/* <div>
                    {
                        !this.state.showMenu && 
                        <div className="settingBtn-container">
                            <Icon onClick={this.onSettingClick.bind(this)}  type="setting" style={{fontSize:"50px",color:"wheat"}}></Icon>
                        </div>
                    }
                </div> */}

                {/* show the setting page */}

                {
                    //!this.state.showMenu ? null:
                    <div className="setting-container">
                        {/* <Link href="/"> */}
                        <div>
                            <PageHeader onBack={this.props.onBackClick/*()=>null*/} title="Settings" />
                        </div>
                        {/* </Link> */}
                        <Menu
                            //defaultSelectedKeys={['video']}
                            //defaultOpenKeys={['Read Full Region']}
                            mode="inline"
                            theme="light"

                        >
                            {/* Video Source */}
                            {/* <VideoSource></VideoSource>*/}
                            {/* <CutOff /> */}

                            <CutOff />

                            {/* //Barcode Format */}
                            <BarcodeFormat></BarcodeFormat>

                            <CutOff />

                            {/* //Scan Settings */}
                            <ScanSettings></ScanSettings>

                            <CutOff />

                            {/* //Read Full Region */}
                            {/* <ReadFullRegion></ReadFullRegion> */}
                            {/* <CutOff /> */}

                            {/* About */}
                            <About></About>

                            {/* Clear Cache */}
                            {/* <ClearCache></ClearCache> */}
                        </Menu>
                    </div>
                }

            </>
        );
    }
}


export default SettingPage;
export { settingsFromPage };