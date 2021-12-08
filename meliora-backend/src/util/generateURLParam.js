const generateURLParam = () => {
	var result = '';
	let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let alphabetLength = alphabet.length;
	for (var i = 0; i < 6; i++) {
		result += alphabet.charAt(Math.floor(Math.random()*alphabetLength));
	}

	return result;
}

export { generateURLParam };