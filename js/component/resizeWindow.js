define(function(){
 	function debounce(fn, delay) {
		var timer = null;
		return function () {
			var context = this, args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				fn.apply(context);
			}, delay);
		};
	}   
    return {
        showNav:function(event) {
            event.stopPropagation();
            document.querySelector('.shadeLayer').classList.toggle('showItem');
	    },
        hideNav:function() {
           document.querySelector('.shadeLayer').classList.remove('showItem');
	    },
        resizeWindow:debounce(function() {
		//document.querySelector('.shadeLayer').classList.remove('showItem ');
		console.log("no work to do")
	}, 250)
    };
})