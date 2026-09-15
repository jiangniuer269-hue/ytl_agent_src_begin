<template>
	<div style="width:400px;">
		<x-grid :options="option"></x-grid>
	</div>
</template>

<script>
	import  $ from 'jquery'
	import XGrid from '@/components/xgrid'
	export default {
		data() {
			return {
				option:"222"
			}
		},
		watch:{
		   
		},
		methods: {
			
		},
		mounted() {
			
		},
		components:{XGrid}
	}

</script>

<style scoped lang="scss">
	
</style>