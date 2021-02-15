import React from "react";
import {getStr} from "../../utils/i18n";
import {SettingsNav} from "./settingsStack";
import {helper, store} from "../../redux/store";
import {SettingsItem, SettingsSeparator} from "../../components/settings/items";
import {Alert, ScrollView} from "react-native";
import {checkUpdate} from "../../utils/checkUpdate";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Snackbar from "react-native-snackbar";
import {NetworkRetry} from "../../components/easySnackbars";
import {DO_LOGOUT} from "../../redux/constants";

export const SettingsScreen = ({navigation}: {navigation: SettingsNav}) => (
	<ScrollView style={{padding: 10}}>
		<SettingsItem
			text={getStr("reportSettings")}
			onPress={() => navigation.navigate("ReportSettings")}
			icon={<Feather name="file-text" size={16} />}
		/>
		<SettingsItem
			text={getStr("scheduleSettings")}
			onPress={() => navigation.navigate("ScheduleSettings")}
			icon={<Feather name="layout" size={16} />}
		/>
		<SettingsItem
			text={getStr("remainderSettings")}
			onPress={() => navigation.navigate("RemainderSettings")}
			icon={<AntDesign name="creditcard" size={16} />}
		/>
		<SettingsSeparator />
		{!helper.mocked() && (
			<>
				<SettingsItem
					text={getStr("holeSettings")}
					onPress={() => navigation.navigate("HoleSettings")}
					icon={<FontAwesome name="tree" size={16} />}
				/>
				<SettingsItem
					text={getStr("passwordManagement")}
					onPress={() => navigation.navigate("PasswordManagement")}
					icon={<FontAwesome name="lock" size={16} />}
				/>
				<SettingsSeparator />
			</>
		)}
		<SettingsItem
			text={getStr("libBookRecord")}
			onPress={() => navigation.navigate("LibBookRecord")}
			icon={<Feather name="book-open" size={16} />}
		/>
		<SettingsSeparator />
		<SettingsItem
			text={getStr("experimental")}
			onPress={() => navigation.navigate("Experimental")}
			icon={<FontAwesome name="flask" size={16} />}
		/>
		<SettingsSeparator />
		<SettingsItem
			text={getStr("checkUpdate")}
			onPress={() => checkUpdate(true)}
			icon={<Feather name="download" size={16} />}
		/>
		<SettingsSeparator />
		<SettingsItem
			text={getStr("feedback")}
			onPress={() => navigation.navigate("Feedback")}
			icon={<Feather name="edit" size={16} />}
		/>
		<SettingsItem
			text={getStr("acknowledgements")}
			onPress={() => navigation.navigate("Acknowledgements")}
			icon={<Feather name="tag" size={16} />}
		/>
		<SettingsItem
			text={getStr("about")}
			onPress={() => navigation.navigate("About")}
			icon={<AntDesign name="copyright" size={16} />}
		/>
		<SettingsSeparator />
		<SettingsItem
			text={getStr("forceLogin")}
			onPress={() => {
				Snackbar.show({
					text: getStr("processing"),
					duration: Snackbar.LENGTH_SHORT,
				});
				helper
					.login({}, () => {}, false)
					.then(() =>
						Snackbar.show({
							text: getStr("success"),
							duration: Snackbar.LENGTH_SHORT,
						}),
					)
					.catch(NetworkRetry);
			}}
			icon={<Feather name="refresh-cw" size={16} />}
		/>
		<SettingsItem
			text={getStr("logout")}
			onPress={() => {
				Alert.alert(getStr("logout"), getStr("confirmLogout"), [
					{text: getStr("cancel")},
					{
						text: getStr("confirm"),
						onPress: () => {
							helper
								.logout()
								.then(() => console.log("Successfully logged out."));
							store.dispatch({type: DO_LOGOUT, payload: undefined});
						},
					},
				]);
			}}
			icon={<Feather name="user-x" size={16} />}
		/>
	</ScrollView>
);
