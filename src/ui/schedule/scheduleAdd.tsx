import React, {useState} from "react";
import {
	Alert,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import {connect} from "react-redux";
import themes from "../../assets/themes/themes";
import {Calendar} from "../../utils/calendar";
import themedStyles from "../../utils/themedStyles";
import {getStr} from "../../utils/i18n";
import {ScheduleNav} from "./scheduleStack";
import {
	addActiveTimeBlocks,
	getOverlappedBlock,
	Schedule,
	ScheduleType,
	TimeBlock,
} from "../../models/schedule/schedule";
import {SCHEDULE_ADD_CUSTOM, SCHEDULE_DEL_OR_HIDE} from "../../redux/constants";
import {State} from "../../redux/store";
import {Choice} from "src/redux/reducers/schedule";
import {useColorScheme} from "react-native-appearance";

interface ScheduleAddProps {
	scheduleList: Schedule[];
	customCnt: number;
	navigation: ScheduleNav;
	addCustom: (payload: Schedule) => void;
	delOrHide: (title: string, block: TimeBlock, choice: Choice) => void;
}

export const numberToCode = (num: number): string => {
	const pow10: number[] = [100000, 10000, 1000, 100, 10, 1];
	let res: string = "";
	pow10.forEach((val) => {
		res += Math.floor(num / val) % 10;
	});
	return res;
};

const dayOfWeekChar = ["", "一", "二", "三", "四", "五", "六", "日"];

const ScheduleAddUI = ({
	scheduleList,
	customCnt,
	navigation,
	addCustom,
	delOrHide,
}: ScheduleAddProps) => {
	const themeName = useColorScheme();
	const theme = themes[themeName];
	const style = styles(themeName);

	const NA = 0;

	const sessionGroups = [
		[1, 2, NA],
		[3, 4, 5],
		[6, 7, NA],
		[8, 9, NA],
		[10, 11, NA],
		[12, 13, 14],
	];

	const [weeks, setWeeks] = useState(
		new Array<boolean>(Calendar.weekCount + 1).fill(false),
	);

	const [sessions, setSessions] = useState(new Array<boolean>(16).fill(false));

	const [day, setDay] = useState(1);

	const [title, setTitle] = useState("");
	const [locale, setLocale] = useState("");

	const valid =
		title.trim().length > 0 &&
		weeks.some((value) => value) &&
		sessions.some((value) => value);

	const updateWeeks = (transform: (original: boolean[]) => void) => () => {
		setWeeks((src) => {
			const original = Array.from(src);
			transform(original);
			return original;
		});
	};

	return (
		<ScrollView style={{padding: 5}}>
			<Text style={style.textHeader}>{getStr("basicInfo")}</Text>
			<View style={{flexDirection: "row"}}>
				<TextInput
					style={style.textInputStyle}
					placeholder={getStr("subject")}
					value={title}
					onChangeText={setTitle}
				/>
				<TextInput
					style={style.textInputStyle}
					placeholder={getStr("localeOptional")}
					value={locale}
					onChangeText={setLocale}
				/>
			</View>
			<Text style={style.textHeader}>{getStr("selectDayOfWeek")}</Text>
			<View style={{flexDirection: "row"}}>
				{Array.from(new Array(7), (_, index) => (
					<TouchableOpacity
						key={index}
						style={[
							style.pressable,
							{
								borderColor:
									index + 1 === day ? theme.colors.accent : "lightgray",
								shadowColor: index + 1 === day ? theme.colors.accent : "gray",
							},
						]}
						onPress={() => setDay(index + 1)}>
						<Text style={style.dayOfWeekCenter} key={index}>
							{getStr("dayOfWeek")[index + 1]}
						</Text>
					</TouchableOpacity>
				))}
			</View>
			<Text style={style.textHeader}>{getStr("selectSession")}</Text>
			<View style={{flexDirection: "row"}}>
				{sessionGroups.map((sessionGroup, index) => (
					<View key={index} style={{flex: 1}}>
						{sessionGroup.map((session) => (
							<TouchableOpacity
								key={session}
								style={[
									style.pressable,
									{
										borderColor: sessions[session]
											? theme.colors.accent
											: "lightgray",
										shadowColor: sessions[session]
											? theme.colors.accent
											: "gray",
									},
								]}
								onPress={() => {
									if (session !== NA) {
										setSessions((src) => {
											const result = Array.from(src);
											result[session] = !result[session];
											return result;
										});
									}
								}}>
								<Text style={style.textCenter}>
									{session !== NA && session}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				))}
			</View>
			<Text style={style.textHeader}>{getStr("selectWeek")}</Text>
			<View>
				{Array.from(new Array(Calendar.weekCount / 6), (_, i) => (
					<View key={i} style={{flexDirection: "row"}}>
						{Array.from(new Array(6), (__, j) => {
							const index = i * 6 + j + 1;
							return (
								<TouchableOpacity
									key={j}
									style={[
										style.pressable,
										{
											borderColor: weeks[index]
												? theme.colors.accent
												: "lightgray",
											shadowColor: weeks[index] ? theme.colors.accent : "gray",
										},
									]}
									onPress={updateWeeks(
										(original) => (original[index] = !original[index]),
									)}>
									<Text style={style.textCenter}>{index}</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				))}
				<View style={{flexDirection: "row"}}>
					<TouchableOpacity
						style={style.pressable}
						onPress={updateWeeks((original) => {
							for (let i = 1; i <= Calendar.weekCount; i += 2) {
								original[i] = true;
							}
						})}>
						<Text style={style.textCenter}>{getStr("chooseOdd")}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={style.pressable}
						onPress={updateWeeks((original) => {
							for (let i = 1; i <= Calendar.weekCount; i += 2) {
								original[i] = false;
							}
						})}>
						<Text style={style.textCenter}>{getStr("notOdd")}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={style.pressable}
						onPress={updateWeeks((original) => {
							for (let i = 2; i <= Calendar.weekCount; i += 2) {
								original[i] = true;
							}
						})}>
						<Text style={style.textCenter}>{getStr("chooseEven")}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={style.pressable}
						onPress={updateWeeks((original) => {
							for (let i = 2; i <= Calendar.weekCount; i += 2) {
								original[i] = false;
							}
						})}>
						<Text style={style.textCenter}>{getStr("notEven")}</Text>
					</TouchableOpacity>
				</View>
			</View>
			<TouchableOpacity
				style={{
					padding: 10,
					margin: 5,
					marginTop: 20,
					borderRadius: 4,
					shadowColor: "grey",
					shadowOffset: {
						width: 1,
						height: 1,
					},
					shadowOpacity: 0.8,
					shadowRadius: 2,
					backgroundColor: valid ? theme.colors.accent : "lightgrey",
				}}
				disabled={!valid}
				onPress={() => {
					const heads = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].filter(
						(i) => sessions[i] && !sessions[i - 1],
					);
					const tails = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].filter(
						(i) => sessions[i] && !sessions[i + 1],
					);
					const ranges = Array.from(heads, (v, k) => [v, tails[k]]);
					const selectedWeeks = Array.from(
						new Array(Calendar.weekCount),
						(_, index) => index + 1,
					).filter((week) => weeks[week]);
					let newSchedule = {
						name: numberToCode(customCnt) + title,
						location: locale,
						activeTime: [],
						delOrHideTime: [],
						delOrHideDetail: [],
						type: ScheduleType.CUSTOM,
					};
					ranges.flatMap((range) =>
						selectedWeeks.map((week) => {
							addActiveTimeBlocks(week, day, range[0], range[1], newSchedule);
						}),
					);

					let overlapList: [TimeBlock, string, boolean][] = getOverlappedBlock(
						newSchedule,
						scheduleList,
					);

					if (overlapList.length) {
						Alert.alert(
							"计划冲突",
							"您新建的计划与下列计划相冲突：\n\n" +
								overlapList
									.map(
										(val) =>
											"「" +
											val[1].substr(val[2] ? 6 : 0) +
											"」\n第" +
											val[0].week +
											"周 周" +
											dayOfWeekChar[val[0].dayOfWeek] +
											" 第" +
											val[0].begin +
											(val[0].begin === val[0].end ? "" : " ~ " + val[0].end) +
											"节",
									)
									.join("\n\n") +
								"\n\n点击“确认”则会覆盖已有计划（如果自定义计划所有时间段均被覆盖，这个计划会被删除），点击“取消”放弃新建计划",
							[
								{
									text: "确认",
									onPress: () => {
										overlapList.forEach((val) => {
											delOrHide(val[1], val[0], Choice.ONCE);
										});
										addCustom(newSchedule);
										navigation.pop();
									},
								},
								{
									text: "取消",
								},
							],
						);
					} else {
						addCustom(newSchedule);
						navigation.pop();
					}
				}}>
				<Text
					style={[
						style.textCenter,
						{
							fontSize: 16,
							fontWeight: "bold",
							color: valid ? "white" : "black",
						},
					]}>
					{getStr("done")}
				</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = themedStyles(({colors}) => {
	return {
		pressable: {
			flex: 1,
			padding: 8,
			margin: 5,
			backgroundColor: colors.background,
			justifyContent: "center",
			borderRadius: 3,
			shadowColor: "grey",
			shadowOffset: {
				width: 1,
				height: 1,
			},
			shadowOpacity: 0.8,
			shadowRadius: 2,
			borderColor: "lightgray",
			borderWidth: 2.5,
		},

		dayOfWeekCenter: {
			textAlign: "center",
			fontSize: 12,
			color: colors.text,
		},

		textCenter: {
			textAlign: "center",
			fontSize: 14,
			color: colors.text,
		},

		textHeader: {
			margin: 4,
			textAlign: "center",
			fontSize: 18,
			marginTop: 20,
			marginBottom: 10,
			color: colors.text,
		},

		textInputStyle: {
			height: 38,
			flex: 1,
			backgroundColor: colors.background,
			textAlign: "left",
			borderColor: "lightgrey",
			borderWidth: 1,
			borderRadius: 5,
			padding: 10,
			marginHorizontal: 5,
		},
	};
});

export const ScheduleAddScreen = connect(
	(state: State) => ({
		scheduleList: state.schedule.baseSchedule,
		customCnt: state.schedule.customCnt,
	}),
	(dispatch) => ({
		addCustom: (payload: Schedule) =>
			dispatch({type: SCHEDULE_ADD_CUSTOM, payload}),
		delOrHide: (title: string, block: TimeBlock, choice: Choice) => {
			dispatch({type: SCHEDULE_DEL_OR_HIDE, payload: [title, block, choice]});
		},
	}),
)(ScheduleAddUI);
