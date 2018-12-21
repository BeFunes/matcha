import geocoder from 'geocoder'

export const getCurrentPosition = () => {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
};