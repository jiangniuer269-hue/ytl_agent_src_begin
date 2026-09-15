<template>
    <ul class="win-ul">
        <li v-if="gametype !=3" v-for="(item,index) in win" :key="index" class="win-li">
            <div class="top lii">
                <div class="dian">{{item.l_msg}}</div>
                <div v-if="item.zhuang_win == 1" class="win">WIN</div>
            </div>
            <div class="bottom lii">
                <div class="dian">{{item.f_msg}}</div>
                <div v-if="item.zhuang_win == 2" class="win">WIN</div>
            </div>
        </li>
        <li v-if="gametype == 3" v-for="(item,index) in win" :key="index" class="win-li">
            <div class="top lii">
               <div class="dian">{{item.f_msg}}</div>
                <div v-if="item.zhuang_win == 2" class="win">WIN</div>
            </div>
            <div class="bottom lii">
                 <div class="dian">{{item.l_msg}}</div>
                <div v-if="item.zhuang_win == 1" class="win">WIN</div>
            </div>
        </li>
    </ul>
</template>

<script>
	import  $ from 'jquery'
	export default {
		name: 'win-scroll',
		props: ['win','gametype'],
		data() {
			return {
				theight:"",
			}
		},
		computed:{

		},
		watch:{
		   "win.length":{
               handler(){
                   $(".win-ul").width(this.win.length * 82)
                   var speed = 500;//自定义滚动速度
                    var windowWidth = parseInt($(".win-ul").width());//整个页面的高度
                    $(".win-ul").parent().animate({"scrollLeft": windowWidth}, speed);
               },
               immediate:true,
           }
		},
		methods: {
            hidepoker(data){
                this.$emit('hidepoker');
            },showpoker(data){
                this.$emit('showpoker',data);
            },
		},
		mounted() {
			
		}
	}

</script>

<style scoped lang="scss">
	.el-table__body{
		border:none;
		border-collapse: collapse;
		tr{
			border-color: #ccc;
			border-collapse: collapse;
			td{
				border-color: #ccc;
				border-collapse: collapse;
				position: relative;
				text-align: center;
				vertical-align: middle;
			}
		}
	}
    .win-ul{
        padding: 0px;
        margin: 0px;
        list-style: none;
        position: absolute;
        bottom: 0px;
        left: 0;
        height: 102px;
        padding: 0;
        overflow-x: auto;
        overflow-y: hidden;
        border:1px solid #ccc;
        min-width:100%;
        .win-li{
            width: 80px;
            height: 100%;
            float: left;
            border-right:2px solid #ccc;
            .lii{
                width:100%;
                height:50%;
                
                text-align: center;
            }
            .top{
                color: blue;
                border-bottom:1px solid #ccc;
                .dian{
                    height: 30px;
                    line-height: 30px;
                    
                }
                .win{
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    color: #fff;
                    background-color: blue
                }
            }
            .bottom{
                color:red;
                .dian{
                    height: 30px;
                    line-height: 30px;
                    
                }
                .win{
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    background-color: red;
                    color: #fff;
                }
            }
        }
    }
</style>
