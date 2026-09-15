<template>
		<table :id="options.id" cellspacing="0" cellpadding="0" border="1" class="el-table__body" width="100%">
                    <tr v-for="(h,hindex) in options.wh[1]" :key="hindex" class="el-table__row">
						<td :style="{height:theight,'vertical-align': 'middle'}" v-for="(w,windex) in options.wh[0]" :key="windex">
              <img v-on:mouseleave="hidepoker()" v-on:mousemove="showpoker(readerData(windex * options.wh[1] + hindex).data)" v-if="readerData(windex * options.wh[1] + hindex).type == 1 && gametype == 0" style="position: absolute;top:0px;left:0px;" src="../../static/images/zhuang.png" width="100%">
              <img v-on:mouseleave="hidepoker()" v-on:mousemove="showpoker(readerData(windex * options.wh[1] + hindex).data)" v-if="readerData(windex * options.wh[1] + hindex).type == 2  && gametype == 0" style="position: absolute;top:0px;left:0px;" src="../../static/images/xian.png" width="100%">

              <img v-on:mouseleave="hidepoker()" v-on:mousemove="showpoker(readerData(windex * options.wh[1] + hindex).data)" v-if="readerData(windex * options.wh[1] + hindex).type == 1 && gametype == 1" style="position: absolute;top:0px;left:0px;" src="../../static/images/long.png" width="100%">
              <img v-on:mouseleave="hidepoker()" v-on:mousemove="showpoker(readerData(windex * options.wh[1] + hindex).data)" v-if="readerData(windex * options.wh[1] + hindex).type == 2  && gametype == 1" style="position: absolute;top:0px;left:0px;" src="../../static/images/hu.png" width="100%">


              <img v-on:mouseleave="hidepoker()" v-on:mousemove="showpoker(readerData(windex * options.wh[1] + hindex).data)" v-if="readerData(windex * options.wh[1] + hindex).type == 1 && gametype == 2" style="position: absolute;top:0px;left:0px;" src="../../static/images/zjhl.png" width="100%">
              <img v-on:mouseleave="hidepoker()" v-on:mousemove="showpoker(readerData(windex * options.wh[1] + hindex).data)" v-if="readerData(windex * options.wh[1] + hindex).type == 2  && gametype == 2" style="position: absolute;top:0px;left:0px;" src="../../static/images/zjhf.png" width="100%">


              <img v-on:mouseleave="hidepoker()" v-on:mousemove="showpoker(readerData(windex * options.wh[1] + hindex).data)" v-if="readerData(windex * options.wh[1] + hindex).type == 1 && gametype == 3" style="position: absolute;top:0px;left:0px;" src="../../static/images/bn.png" width="100%">
              <img v-on:mouseleave="hidepoker()" v-on:mousemove="showpoker(readerData(windex * options.wh[1] + hindex).data)" v-if="readerData(windex * options.wh[1] + hindex).type == 2  && gametype == 3" style="position: absolute;top:0px;left:0px;" src="../../static/images/rn.png" width="100%">


              <img v-on:mouseleave="hidepoker()" v-on:mousemove="showpoker(readerData(windex * options.wh[1] + hindex).data)" v-if="readerData(windex * options.wh[1] + hindex).type == 3" style="position: absolute;top:0px;left:0px;" src="../../static/images/he.png" width="100%">
              <img v-on:mouseleave="hidepoker()" v-on:mousemove="showpoker(readerData(windex * options.wh[1] + hindex).data)" v-if="readerData(windex * options.wh[1] + hindex).type == 4 && gametype == 0" style="position: absolute;top:0px;left:0px;" src="../../static/images/six.png" width="100%">

              <img v-if="readerData(windex * options.wh[1] + hindex).blue1 == 1 && gametype == 0" style="position: absolute;bottom:0px;right:0px;" src="../../static/images/blue1.png" width="30%">
              <img v-if="readerData(windex * options.wh[1] + hindex).red1 == 1 && gametype == 0" style="position: absolute;top:0px;left:0px;" src="../../static/images/red1.png" width="30%">

              <img v-if="readerData(windex * options.wh[1] + hindex).blue0" style="position: absolute;top:0px;left:0px;" src="../../static/images/blue0.png" width="100%">
              <img v-if="readerData(windex * options.wh[1] + hindex).red0" style="position: absolute;top:0px;left:0px;" src="../../static/images/red0.png" width="100%">

              <img v-if="readerData(windex * options.wh[1] + hindex).blue2" style="position: absolute;bottom:0px;right:0px;max-width: 40%;" src="../../static/images/blue2.png" >
              <img v-if="readerData(windex * options.wh[1] + hindex).red2" style="position: absolute;top:0px;left:0px;max-width: 40%;" src="../../static/images/red2.png" >

              <span class="num" v-if="readerData(windex * options.wh[1] + hindex).num != 0 && readerData(windex * options.wh[1] + hindex).num != undefined" style="    color: green;
    position: absolute;
    top: 0px;
    left: 0px;
    font-size: 12px;
    width: 100%;
    height: 100%;
    text-align: center;
    font-weight: bolder;"><img style="    width: 100%;
    height: 100%;
    position: absolute;
    top: 0; 
    left: 0;" src="../../static/images/hegang.png"></span>

              <img v-if="readerData(windex * options.wh[1] + hindex).heg" style="position: absolute;bottom:0px;right:0px;" src="../../static/images/heg.png" width="60%" >

              <img v-if="readerData(windex * options.wh[1] + hindex).d1 == '2'" style="position: absolute;top:0px;left:0px;" src="../../static/images/blue0.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).d1 == '1'" style="position: absolute;top:0px;left:0px;" src="../../static/images/red0.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).d2 == '2'" style="position: absolute;bottom:0px;left:0px;" src="../../static/images/blue0.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).d2 == '1'" style="position: absolute;bottom:0px;left:0px;" src="../../static/images/red0.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).d3 == '2'" style="position: absolute;top:0px;right:0px;" src="../../static/images/blue0.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).d3 == '1'" style="position: absolute;top:0px;right:0px;" src="../../static/images/red0.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).d4 == '2'" style="position: absolute;bottom:0px;right:0px;" src="../../static/images/blue0.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).d4 == '1'" style="position: absolute;bottom:0px;right:0px;" src="../../static/images/red0.png" width="50%" height="50%" >

              <img v-if="readerData(windex * options.wh[1] + hindex).e1 == '2'" style="position: absolute;top:0px;left:0px;" src="../../static/images/blue2.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).e1 == '1'" style="position: absolute;top:0px;left:0px;" src="../../static/images/red2.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).e2 == '2'" style="position: absolute;bottom:0px;left:0px;" src="../../static/images/blue2.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).e2 == '1'" style="position: absolute;bottom:0px;left:0px;" src="../../static/images/red2.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).e3 == '2'" style="position: absolute;top:0px;right:0px;" src="../../static/images/blue2.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).e3 == '1'" style="position: absolute;top:0px;right:0px;" src="../../static/images/red2.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).e4 == '2'" style="position: absolute;bottom:0px;right:0px;" src="../../static/images/blue2.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).e4 == '1'" style="position: absolute;bottom:0px;right:0px;" src="../../static/images/red2.png" width="50%" height="50%" >

              <img v-if="readerData(windex * options.wh[1] + hindex).f1 == '2'" style="position: absolute;top:0px;left:0px;" src="../../static/images/blueg.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).f1 == '1'" style="position: absolute;top:0px;left:0px;" src="../../static/images/redg.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).f2 == '2'" style="position: absolute;bottom:0px;left:0px;" src="../../static/images/blueg.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).f2 == '1'" style="position: absolute;bottom:0px;left:0px;" src="../../static/images/redg.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).f3 == '2'" style="position: absolute;top:0px;right:0px;" src="../../static/images/blueg.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).f3 == '1'" style="position: absolute;top:0px;right:0px;" src="../../static/images/redg.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).f4 == '2'" style="position: absolute;bottom:0px;right:0px;" src="../../static/images/blueg.png" width="50%" height="50%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).f4 == '1'" style="position: absolute;bottom:0px;right:0px;" src="../../static/images/redg.png" width="50%" height="50%" >

              <img v-if="readerData(windex * options.wh[1] + hindex).g1 == '2'" style="position: absolute;top:0px;left:0px;" src="../../static/images/blue0.png" width="100%" height="100%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).g1 == '1'" style="position: absolute;top:0px;left:0px;" src="../../static/images/red0.png" width="100%" height="100%" >
              <img v-if="readerData(windex * options.wh[1] + hindex).blue3" style="position: absolute;bottom:0px;right:0px;max-width: 40%;" src="../../static/images/blue2.png" >
              <img v-if="readerData(windex * options.wh[1] + hindex).red3" style="position: absolute;top:0px;left:0px;max-width: 40%;" src="../../static/images/red2.png" >

            </td>
					</tr>
		</table>
</template>

<script>
	import  $ from 'jquery'
	export default {
		name: 'x-grid',
		props: ['options','gametype'],
		data() {
			return {
				theight:"",
			}
		},
		computed:{

		},
		watch:{
		   twidth:{
			   handler(){
					this.$nextTick(() => {
						this.theight = $("#"+this.options.id).find("tr td").width() +"px";
						setTimeout(()=>{
                $(".xjts").height($(".zzl").height()-2)
            },500)
						if($("#"+this.options.id).find("tr td").width()<12){
							$("#"+this.options.id).find("tr td .num").css({
								'transform':'scale(0.5)'
							})
						}
					})
			   },
			   immediate: true
		   }
		},
		methods: {
        hidepoker(data){
            this.$emit('hidepoker');
        },showpoker(data){
            this.$emit('showpoker',data);
        },
			readerData(index){
				if(this.options.data[index]){
					return this.options.data[index]
				}else{
					return {}
				}
			},
      resize(){
          this.$nextTick(() => {
              setTimeout(()=>{
                  this.theight = $("#"+this.options.id).find("tr td").width() +"px";
                  setTimeout(()=>{
                      $(".xjts").height($(".zzl").height()-2)
                  },500)
				  if($("#"+this.options.id).find("tr td").width()<12){
						$("#"+this.options.id).find("tr td .num").css({
							'transform':'scale(0.5)'
						})
					}
              },1000)

          })
      },
		},
		mounted() {
			this.$nextTick(() => {
			  setTimeout(()=>{
              	  this.theight = $("#"+this.options.id).find("tr td").width() +"px";
            setTimeout(()=>{
                $(".xjts").height($(".zzl").height()-2)
            },500)
              },1000)
          })
		$(window).resize(()=>{
          this.$nextTick(() => {
			  setTimeout(()=>{
              	  this.theight = $("#"+this.options.id).find("tr td").width() +"px";
            setTimeout(()=>{
                $(".xjts").height($(".zzl").height()-2)
            },500)
              },1000)
          })
      })
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
</style>
