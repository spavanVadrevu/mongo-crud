function del(id){
	console.log(id);
	fetch("http://localhost:3400/delete/"+id, {method:'DELETE'})
	.then(res=>{console.log("hi")})
}