
require('babel!../components/C_header/header.jsx');
let a = () => {
	var text = document.createTextNode('xlobo.com');
	document.getElementsByTagName('body')[0].appendChild(text);
}
a();
