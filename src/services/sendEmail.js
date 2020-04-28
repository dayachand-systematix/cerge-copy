
import { Linking } from 'react-native';
import {EMAIL_SUBJECT, EMAIL_TO} from "../config/index";


export async function sendEmail() {


    let url = `mailto:${EMAIL_TO}?subject=${EMAIL_SUBJECT}`;

    // check if we can use this link
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
        throw new Error('Provided URL can not be handled');
    }

    return Linking.openURL(url);
}
