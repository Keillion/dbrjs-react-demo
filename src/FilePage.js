import React from 'react';
import { PageHeader,Upload,Icon,message,List,Typography} from 'antd';
import './FilePage.css';
import './Layout.css';
import {settingsFromPage} from './SettingPage';


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
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

function isLink(possibleLink){
    if (!possibleLink.startsWith('http') && (possibleLink.startsWith('www') || -1 !== possibleLink.indexOf('.com') ||
        -1 !== possibleLink.indexOf('.net') || -1 !== possibleLink.indexOf('.org') || -1 !== possibleLink.indexOf('.edu'))) {
        return true;
    }
    else{
        return false;
    }
}

var Dynamsoft;
var reader = null;


class FilePage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showFile:true,
            loading: false,
            resultsInfo:"",
            ...settingsFromPage,
            isloadingNewFile:false
        }
    }

    componentDidMount(){
        Dynamsoft = window.Dynamsoft;
        Dynamsoft.BarcodeReader.createInstance().then(r=>{
            reader=r;
        });
        //Avoid page dragging
        let noDragDoms = document.getElementsByClassName("no-drag");
        for(let i=0;i<noDragDoms.length;i++){
            noDragDoms[i].addEventListener('touchmove', function (e){
                e.preventDefault(); 
            }, {passive: false}); 
        }
    }
    
    componentWillUnmount(){
        reader&&reader.destroy();
        reader=null;
    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true ,file:info.file.originFileObj});
            return;
        }
        if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
                imageUrl,
                loading: false,
                isloadingNewFile:true,
            }),
        );
        this.decodeFile(info.file.originFileObj);
        }
    };

    onSelectNewFile(){
        this.setState({
            isloadingNewFile:false,
        })
    }

    async decodeFile(file){
        var config={};
        message.config({
            top:window.innerHeight/2,
            duration:2,
        });
        
        // var settings= await reader.getRuntimeSettings();
        // settings.barcodeFormatIds=this.state.barcodeFormat;
        // settings.localizationModes=this.state.localization;
        // settings.deblurLevel = this.state.deblurLevel;
        // console.log(settings);
        // await reader.updateRuntimeSettings(settings);

        reader.decode(file).then((results)=>{
            if (results.length > 0) {
                console.log(results);
                var txts = [];
                for (var i = 0; i < results.length; ++i) {
                    txts.push(results[i].BarcodeText);
                }
                this.setState({
                    resultsInfo:results
                })
    
                config.content="Found "+results.length+" barcode!";
                config.icon=<Icon type="check" style={{color:"#FE8E14"}}></Icon>;
                message.open(config);
            }
            else
            {
                config.content="No barcode found!";
                config.icon=<Icon type="close" style={{color:"#FE8E14"}}></Icon>;
                message.open(config);
                this.setState({
                    resultsInfo:""
                })
            }
        }).catch(e=>{
            config.content="Not supported image file!"
            config.icon=<Icon type="frown" style={{color:"#FE8E14"}}></Icon>;
            message.open(config);
            console.log(e);
        })    
    }

    copyScannerResult=e=>{
        const kUtil=window.kUtil;
        kUtil.copyToClipBoard(e.target.innerText);
        var config={};
        config.content="copy successfully!";
        config.icon=<Icon type="smile" style={{color:"#FE8E14"}}></Icon>;
        message.config({
            top:window.innerHeight-180,
            duration:1.5,
        });
        message.open(config);
    }

    

    render(){
        const uploadButton = (
            <div className="custom-upload-box">
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;

        return(
            <>
                {/* show the file page */}
                <div className="file-container no-drag">
                    <PageHeader onBack={this.props.onBackClick} title="Files"  />
                </div>

                <div className="upload-container no-drag">
                    <div className="upload" onClick={this.onSelectNewFile.bind(this)}>
                        {/* <div className="upload-bg">
                            <div className="upload-box">
                                <Icon type="plus"/>
                                <div>upload</div>
                            </div>
                        </div>
                        <label id="upload-label" htmlFor="input"></label>
                        <input type="file" id="input" hidden onChange="uploadFile(this.files)"></input> */}
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            // action="/upload"
                            //beforeUpload={beforeUpload}
                            onChange={this.handleChange}
                            supportServerRender={true}
                            style={{width:180,height:180,display:"table"}}
                        >
                            {this.state.isloadingNewFile&&imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>    
                    </div>
                </div>

                {
                    (this.state.resultsInfo.length)&&
                    <List
                    // header={<div>Scanning Result</div>}
                    className="decodefile-result-list"
                    dataSource = {this.state.resultsInfo}
                    bordered
                    size="small"
                    renderItem={Item=>(
                        <List.Item style={{display:"list-item"}}>
                            <Typography.Text>
                                <span style={{color:"#FE8E14"}}>{[Item.BarcodeFormatString]}: </span>
                            </Typography.Text>
                            {isLink(Item.BarcodeText)?
                            <a href={'http://'+Item.BarcodeText} target={"_blank"} style={{textDecoration:"underline"}} >{Item.BarcodeText}</a>
                            :<span onClick={this.copyScannerResult} style={{fontSize:16}}>{Item.BarcodeText}</span>  }
                        </List.Item>
                    )}
                    >
                    </List>
                }   
            </>
        )
    }
}

export default FilePage;