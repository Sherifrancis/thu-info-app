import MailCore from "thu-info-mailcore";
import {helper, store} from "../redux/store";
import {Platform} from "react-native";
import {SET_EMAIL_UNSEEN} from "../redux/constants";

export const emailInit = async () => {
	if (Platform.OS === "ios") {
		return;
	}
	const INBOX = "INBOX";
	await MailCore.loginImap({
		hostname: "mails.tsinghua.edu.cn",
		port: 993, // port for smtp is 465
		username: `${helper.emailName}@mails.tsinghua.edu.cn`,
		password: helper.password,
		authType: 0,
	});
	const {unseenCount} = await MailCore.statusFolder({folder: INBOX});
	store.dispatch({type: SET_EMAIL_UNSEEN, payload: unseenCount});
};
