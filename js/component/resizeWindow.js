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
            document.querySelector('body').classList.toggle('OffCanvas-Active');
	    },
        hideNav:function() {
		//	console.log("propergation");
                if(document.querySelector('.OffCanvas-Active')){
                    document.querySelector('body').classList.remove('OffCanvas-Active');
                }
	    },
        resizeWindow:debounce(function() {
		document.querySelector('body').classList.remove('OffCanvas-Active');
	}, 250)
    };
})