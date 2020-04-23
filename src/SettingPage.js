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
var _Code39 = Dynamsoft.EnumBarcodeFormat.BF_CODE_39;
var _Code128 = Dynamsoft.EnumBarcodeFormat.BF_CODE_128;
var _Code93 = Dynamsoft.EnumBarcodeFormat.BF_CODE_93;
var _Codabar = Dynamsoft.EnumBarcodeFormat.BF_CODABAR;
var _ITF = Dynamsoft.EnumBarcodeFormat.BF_ITF;
var _EAN13 = Dynamsoft.EnumBarcodeFormat.BF_EAN_13;
var _EAN8 = Dynamsoft.EnumBarcodeFormat.BF_EAN_8;
var _UPCA = Dynamsoft.EnumBarcodeFormat.BF_UPC_A;
var _UPCE = Dynamsoft.EnumBarcodeFormat.BF_UPC_E;
var _Industrial25 = Dynamsoft.EnumBarcodeFormat.BF_INDUSTRIAL_25;
var _Code39Extended = Dynamsoft.EnumBarcodeFormat.BF_CODE_39_EXTENDED;

var _PDF417 = Dynamsoft.EnumBarcodeFormat.BF_PDF417;
var _QRCode = Dynamsoft.EnumBarcodeFormat.BF_QR_CODE;
var _DataMatrix = Dynamsoft.EnumBarcodeFormat.BF_DATAMATRIX;
var _AztecCode = Dynamsoft.EnumBarcodeFormat.BF_AZTEC;
var _MaxiCode = Dynamsoft.EnumBarcodeFormat.BF_MAXICODE;
var _MicroPDF417 = Dynamsoft.EnumBarcodeFormat.BF_MICRO_PDF417;
var _MicroQR = Dynamsoft.EnumBarcodeFormat.BF_MICRO_QR;
var _PatchCode = Dynamsoft.EnumBarcodeFormat.BF_PATCHCODE;
var _GS1Composite = Dynamsoft.EnumBarcodeFormat.BF_GS1_COMPOSITE;
var _GS1DataBar = Dynamsoft.EnumBarcodeFormat.BF_GS1_DATABAR;
// var _PostalCode = Dynamsoft.EnumBarcodeFormat_2.BF2_POSTALCODE;
// var _DotCode = Dynamsoft.EnumBarcodeFormat_2.BF2_DOTCODE;


const allOneDOptions = ['Code 39', 'Code 128', 'Code 93', 'CODABAR', 'ITF', 'EAN 13', 'EAN 8', 'UPC A', 'UPC E', 'Industrial 25', 'Code 39 Extended']

const allTwoDOptions = ['PDF417', 'QR Code', 'Data Matrix', 'Aztec Code', 'MaxiCode', 'Micro PDF417', 'Micro QR', 'Patch Code', 'GS1 Composite', 'GS1 DataBar'];
if (!Dynamsoft.BarcodeReader._bUseFullFeature) {
    allTwoDOptions.length = 3;
}

const formats = { "1D": _1D, 'Code 39': _Code39, 'Code 128': _Code128, 'Code 93': _Code93, 'CODABAR': _Codabar, 'ITF': _ITF, 'EAN 13': _EAN13, 'EAN 8': _EAN8, 'UPC A': _UPCA, 'UPC E': _UPCE, 'Industrial 25': _Industrial25, 'Code 39 Extended': _Code39Extended, "PDF417": _PDF417, "QR Code": _QRCode, "Data Matrix": _DataMatrix, "Aztec Code": _AztecCode, "MaxiCode": _MaxiCode, 'Micro PDF417': _MicroPDF417, 'Micro QR': _MicroQR, 'Patch Code': _PatchCode, "GS1 DataBar": _GS1DataBar, "GS1 Composite": _GS1Composite };
var _all = 0;
allOneDOptions.forEach(item => { _all += formats[item] });
allTwoDOptions.slice(0,3).forEach(item => { _all += formats[item] });
settingsFromPage.barcodeFormat = _all;


class BarcodeFormat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            OneDcheckedList: allOneDOptions,
            othersCheckedList: allTwoDOptions,
            indeterminate: false,
            OneDcheckAll: true
        }
    }

    onOneDChange = checkedList => {
        this.setState({
            OneDcheckedList: checkedList,
            indeterminate: !!checkedList.length && checkedList.length < allOneDOptions.length,
            OneDcheckAll: checkedList.length === allOneDOptions.length
        }, this.getBarcodeList)
    }

    getBarcodeList = () => {
        settingsFromPage.barcodeFormat = 0;
        this.state.OneDcheckedList.map((format) => {
            settingsFromPage.barcodeFormat = settingsFromPage.barcodeFormat | formats[format];
        })
        this.state.othersCheckedList.map((format) => {
            settingsFromPage.barcodeFormat = settingsFromPage.barcodeFormat | formats[format];
        })
        console.log(settingsFromPage.barcodeFormat)
    }

    onChange = checkedList => {
        this.setState({
            othersCheckedList: checkedList
        }, this.getBarcodeList)
    }

    onOneDCheckAllChange = e => {
        this.setState({
            OneDcheckedList: e.target.checked ? allOneDOptions : [],
            indeterminate: false,
            OneDcheckAll: e.target.checked,
        }, this.getBarcodeList);
    };

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
                        <Checkbox.Group
                            value={this.state.OneDcheckedList}
                            onChange={this.onOneDChange}
                            style={checkGroupStyle}
                        >
                            <Row>
                                {
                                    allOneDOptions.map((item, index) => {
                                        var key = item;
                                        return (<Col span={8} style={AttributeStyle} key={key + index}>
                                            <Checkbox value={key} format={formats[key]} >{key}</Checkbox>
                                        </Col>)
                                    })
                                }
                            </Row>
                        </Checkbox.Group>
                        <Divider dashed />
                        <Checkbox.Group
                            // value={this.state.othersCheckedList}
                            onChange={this.onChange}
                            style={checkGroupStyle}
                            defaultValue={this.state.othersCheckedList.slice(0, 3)}
                        >
                            <Row>
                                {
                                    allTwoDOptions.map((item, index) => {
                                        var key = item;
                                        return (<Col span={8} style={AttributeStyle} key={key + index}>
                                            <Checkbox value={key} format={formats[key]} >{key}</Checkbox> 
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