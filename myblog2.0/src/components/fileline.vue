<template>
    <div id="fileline">
        <div class="title">
            <img :src="imgSrc" alt="" srcset="">
            <span>{{file.name}}</span>
        </div>
        <div class="size">
            <span v-show="file.type!='dir'">{{file.size}}</span>
        </div>
        <div class="control">
            <span v-show="file.type!='dir'">删除</span>
            <span v-show="file.type!='dir'">重命名</span>
            <span v-show="file.type!='dir'">复制提取码</span>
            <span v-show="file.type=='dir'">进入</span>
        </div>
    </div>
</template>

<script>
import word from '../assets/file_icon/word.png'
import video from '../assets/file_icon/video.png'
import other from '../assets/file_icon/other.png'
import picture from '../assets/file_icon/picture.png'
import dir from '../assets/file_icon/dir.png'
import zip from '../assets/file_icon/zip.png'
import pdf from '../assets/file_icon/pdf.png'
import ppt from '../assets/file_icon/ppt.png'
import txt from '../assets/file_icon/txt.png'
 
export default {
    props:['file'],
    data(){
        return {

        }
    },
    computed:{
        imgSrc(){
            let {type} = this.file
            type = type.toLocaleLowerCase()

            if(type=='doc'||type=='docx'){
                return word
            }else if(type=='ppt'||type=='pptx'){
                return ppt
            }else if(type=='txt'){
                return txt
            }else if(type=='zip'||type=='7z'){
                return zip
            }else if(type=='mp4'){
                return video
            }else if(type=='png'||type=='jpg'||type=='jpeg'||type=='gif'){
                return picture
            }else if( type=='pdf'){
                return pdf
            }else if(type=='dir'){  













                
                
                
                
                
                
                
 
 return dir
            }else{
                return other
            }
        }
    },
}
</script>

<style lang="less" scoped>
#fileline{
    display: flex;
    height: 44px;
    justify-content: space-between;
    border-bottom: 1px solid #eeeeee;
}
.title{
    min-width: 350px;
    max-width: 350px;
    overflow: hidden;
    text-overflow:ellipsis; 
    white-space: nowrap;

    img{
        height: 43px;
        vertical-align: middle;
    }
    span{
        font-size: 16px;
        vertical-align: middle;
        margin-left: 10px;
    }
}
.size{
    span{
        font-size: 16px;
        line-height: 44px;
    }
}
.control{
    min-width: 190px;
    text-align: right;

    span{
        font-size: 16px;
        line-height: 44px;
        cursor: pointer;
        color: #38b7ea;
        margin-left: 10px;

        &:hover{
            text-decoration: underline;
        }
    }
}
</style>