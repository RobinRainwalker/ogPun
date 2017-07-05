
$(() => {
console.log('landing page loaded');

	$.ajax({
	    method: 'POST',
	    url: '/',
	    data: {},
	    success: response => {
	      console.log(response);
	      user = response;
	    }, error: msg => {
	      console.log(msg);
	    }
	});
});