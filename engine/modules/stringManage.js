function getTemp(message) {
	var index = message.search("TEMP");
	var temp = message.slice(index-5, index);
	temp = parseFloat(temp);
	return temp;
}

function getHumid(message) {
	var index = message.search("HUMID");
	var humid = message.slice(index-5, index);
	humid = parseFloat(humid);
	return humid;
}

function getAlcohol(message) {
	var index_high = message.search("ALC");
	var index_low = message.lastIndexOf("!");
	var alcohol = message.slice(index_low+1, index_high);
	alcohol = parseFloat(alcohol);
	return alcohol;

	//old code
	/*var index_high = message.search("ADC");
	var index_low = message.lastIndexOf("!");
	var adc = message.slice(index_low+1, index_high);
	adc = parseFloat(adc);
	return adc;*/
}

module.exports = {
	getTemp,
	getHumid,
	getAlcohol
}