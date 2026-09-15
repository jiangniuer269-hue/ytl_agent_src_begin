<template>
    <span @click="dosearch" v-html="relaFix"></span>
</template>

<script>
	import  $ from 'jquery'
	export default {
		name: 'relation',
		props: ['rela'],
		data() {
			return {
				theight:"",
			}
		},
		computed:{
            relaFix(){
                var reg=/\(([^\)]*)\)/g;
                return this.rela && this.rela.replace(reg,"(<a style='color:#009688;cursor:pointer;'>$1</a>)");
            }
		},
		watch:{
		   
		},
		methods: {
           dosearch(e){
               console.log(e.target.text)
               this.$emit("getsearch",e.target.text);
           }
		},
		mounted() {
			
		}
	}

</script>

<style scoped lang="scss">
	
</style>
