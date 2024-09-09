// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import { firebaseConfig } from '$lib/firebaseConfig';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

export const prerender = true;
export const trailingSlash = 'never';
export async function load() {
	try {
		const app = (await getApps().length) === 0 ? await initializeApp(firebaseConfig) : getApp();
		return {};
	} catch (error) {
		console.log(error)
		return {}
	}
}