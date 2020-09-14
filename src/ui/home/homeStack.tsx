import React from "react";
import {
	createStackNavigator,
	StackNavigationProp,
} from "@react-navigation/stack";
import {HomeScreen} from "./home";
import {ReportScreen} from "./report";
import {EvaluationScreen} from "./evaluation";
import {FormScreen} from "./form";
import {getStr} from "../../utils/i18n";
import {ExpenditureScreen} from "./expenditure";
import {ClassroomListScreen} from "./classroomList";
import {ClassroomDetailScreen} from "./classroomDetail";
import {RouteProp} from "@react-navigation/native";
import {DormScoreScreen} from "./dormScore";
import {ConfigureDormScreen} from "./configureDorm";
import {LibraryScreen} from "./library";
import {Library, LibraryFloor, LibrarySection} from "../../models/home/library";
import {LibraryFloorScreen} from "./libraryFloor";
import {LibrarySectionScreen} from "./librarySection";
import {LibrarySeatScreen} from "./librarySeat";
import {PhysicalExamScreen} from "./physicalExam";
import {JoggingScreen} from "./jogging";

export type HomeStackParamList = {
	Home: undefined;
	Report: undefined;
	Evaluation: undefined;
	Form: {name: string; url: string};
	PhysicalExam: undefined;
	Jogging: undefined;
	Expenditure: undefined;
	ClassroomList: undefined;
	ClassroomDetail: {name: string};
	Library: undefined;
	LibraryFloor: {library: Library; dateChoice: 0 | 1};
	LibrarySection: {floor: LibraryFloor; dateChoice: 0 | 1};
	LibrarySeat: {section: LibrarySection; dateChoice: 0 | 1};
	DormScore: undefined;
	ConfigureDorm: {callback: () => any};
};

export type FormRouteProp = RouteProp<HomeStackParamList, "Form">;
export type ClassroomDetailRouteProp = RouteProp<
	HomeStackParamList,
	"ClassroomDetail"
>;
export type ConfigureDormRouteProp = RouteProp<
	HomeStackParamList,
	"ConfigureDorm"
>;
export type LibraryFloorRouteProp = RouteProp<
	HomeStackParamList,
	"LibraryFloor"
>;
export type LibrarySectionRouteProp = RouteProp<
	HomeStackParamList,
	"LibrarySection"
>;
export type LibrarySeatRouteProp = RouteProp<HomeStackParamList, "LibrarySeat">;

const Stack = createStackNavigator<HomeStackParamList>();

export type HomeNav = StackNavigationProp<HomeStackParamList>;

export const HomeStackScreen = () => (
	<Stack.Navigator>
		<Stack.Screen
			name="Home"
			component={HomeScreen}
			options={{title: getStr("home")}}
		/>
		<Stack.Screen
			name="Report"
			component={ReportScreen}
			options={{title: getStr("report")}}
		/>
		<Stack.Screen
			name="Evaluation"
			component={EvaluationScreen}
			options={{title: getStr("teachingEvaluation")}}
		/>
		<Stack.Screen
			name="Form"
			component={FormScreen}
			options={({route}) => ({title: route.params.name})}
		/>
		<Stack.Screen
			name="PhysicalExam"
			component={PhysicalExamScreen}
			options={{title: getStr("physicalExam")}}
		/>
		<Stack.Screen
			name="Jogging"
			component={JoggingScreen}
			options={{title: getStr("jogging")}}
		/>
		<Stack.Screen
			name="Expenditure"
			component={ExpenditureScreen}
			options={{title: getStr("expenditure")}}
		/>
		<Stack.Screen
			name="ClassroomList"
			component={ClassroomListScreen}
			options={{title: getStr("classroomState")}}
		/>
		<Stack.Screen
			name="ClassroomDetail"
			component={ClassroomDetailScreen}
			options={({route}) => ({title: route.params.name})}
		/>
		<Stack.Screen
			name="Library"
			component={LibraryScreen}
			options={{title: getStr("library")}}
		/>
		<Stack.Screen
			name="LibraryFloor"
			component={LibraryFloorScreen}
			options={({route}) => ({title: route.params.library.zhName})}
		/>
		<Stack.Screen
			name="LibrarySection"
			component={LibrarySectionScreen}
			options={({route}) => ({title: route.params.floor.zhNameTrace})}
		/>
		<Stack.Screen
			name="LibrarySeat"
			component={LibrarySeatScreen}
			options={({route}) => ({title: route.params.section.zhNameTrace})}
		/>
		<Stack.Screen
			name="DormScore"
			component={DormScoreScreen}
			options={{title: getStr("dormScore")}}
		/>
		<Stack.Screen
			name="ConfigureDorm"
			component={ConfigureDormScreen}
			options={{title: getStr("configureDorm")}}
		/>
	</Stack.Navigator>
);
