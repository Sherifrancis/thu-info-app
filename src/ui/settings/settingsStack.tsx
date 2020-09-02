import {
	createStackNavigator,
	StackNavigationProp,
} from "@react-navigation/stack";
import {SettingsScreen} from "./settings";
import {getStr} from "../../utils/i18n";
import React from "react";
import {FeedbackScreen} from "./feedback";
import {PopiScreen} from "./popi";
import {EleRecordScreen} from "./eleRecord";
import {LibBookRecordScreen} from "./libBookRecord";
import {ReportSettingsScreen} from "./reportSettings";

type SettingsStackParamList = {
	Settings: undefined;
	Feedback: undefined;
	Popi: undefined;
	EleRecord: undefined;
	LibBookRecord: undefined;
	ReportSettings: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

export type SettingsNav = StackNavigationProp<SettingsStackParamList>;

export const SettingStackScreen = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Settings"
			component={SettingsScreen}
			options={{title: getStr("settings")}}
		/>
		<Stack.Screen
			name="Feedback"
			component={FeedbackScreen}
			options={{title: getStr("feedback")}}
		/>
		<Stack.Screen
			name="Popi"
			component={PopiScreen}
			options={{title: getStr("popi")}}
		/>
		<Stack.Screen
			name="EleRecord"
			component={EleRecordScreen}
			options={{title: getStr("eleRecord")}}
		/>
		<Stack.Screen
			name="LibBookRecord"
			component={LibBookRecordScreen}
			options={{title: getStr("libBookRecord")}}
		/>
		<Stack.Screen
			name="ReportSettings"
			component={ReportSettingsScreen}
			options={{title: getStr("reportSettings")}}
		/>
	</Stack.Navigator>
);
