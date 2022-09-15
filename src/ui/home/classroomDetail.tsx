import {
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import {useEffect, useRef, useState} from "react";
import {ClassroomDetailRouteProp} from "../../components/Root";
import {getStr} from "../../utils/i18n";
import Snackbar from "react-native-snackbar";
import IconLeft from "../../assets/icons/IconLeft";
import IconRight from "../../assets/icons/IconRight";
import themes from "../../assets/themes/themes";
import {useColorScheme} from "react-native";
import {helper} from "../../redux/store";
import dayjs from "dayjs";

export const ClassroomDetailScreen = ({
	route: {
		params: {searchName, weekNumber},
	},
}: {
	route: ClassroomDetailRouteProp;
}) => {
	const weekCount = 18;
	const current = dayjs();
	const dayOfWeek = current.day() === 0 ? 7 : current.day();

	const [data, setData] = useState<[number, number, [string, number[]][]]>([
		Math.max(weekNumber, 1),
		dayOfWeek,
		[],
	]);
	const prev = useRef<[number, [string, number[]][]]>();
	const next = useRef<[number, [string, number[]][]]>();
	const currWeek = data[0];
	const [refreshing, setRefreshing] = useState(false);

	const currentTime = current.format("HHmm");
	const currentPeriod = (() => {
		if (
			weekNumber < data[0] ||
			(weekNumber === data[0] && dayOfWeek < data[1])
		) {
			return 1;
		} else if (
			weekNumber > data[0] ||
			(weekNumber === data[0] && dayOfWeek > data[1])
		) {
			return 7;
		} else if (currentTime < "0935") {
			return 1;
		} else if (currentTime < "1215") {
			return 2;
		} else if (currentTime < "1505") {
			return 3;
		} else if (currentTime < "1655") {
			return 4;
		} else if (currentTime < "1840") {
			return 5;
		} else if (currentTime < "2145") {
			return 6;
		} else {
			return 7;
		}
	})();

	const themeName = useColorScheme();
	const theme = themes(themeName);

	const refresh = () => {
		setRefreshing(true);
		helper
			.getClassroomState(searchName, currWeek)
			.then((res) =>
				setData((o) => {
					if (o[0] === data[0]) {
						setRefreshing(false);
						return [o[0], o[1], res];
					} else {
						return o;
					}
				}),
			)
			.catch(() =>
				Snackbar.show({
					text: getStr("networkRetry"),
					duration: Snackbar.LENGTH_SHORT,
				}),
			);
	};

	useEffect(() => {
		if (prev.current && data[0] === prev.current[0]) {
			next.current = [data[0] + 1, data[2]];
			setData([data[0], data[1], prev.current[1]]);
			prev.current = undefined;
		} else if (next.current && data[0] === next.current[0]) {
			prev.current = [data[0] - 1, data[2]];
			setData([data[0], data[1], next.current[1]]);
			next.current = undefined;
		} else {
			refresh();
		}
		if (
			data[0] > 1 &&
			(prev.current === undefined || prev.current[0] !== data[0] - 1)
		) {
			helper
				.getClassroomState(searchName, data[0] - 1)
				.then((res) => (prev.current = [data[0] - 1, res]));
		}
		if (
			data[0] < weekCount &&
			(next.current === undefined || next.current[0] !== data[0] + 1)
		) {
			helper
				.getClassroomState(searchName, data[0] + 1)
				.then((res) => (next.current = [data[0] + 1, res]));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currWeek]);

	return (
		<View style={{backgroundColor: theme.colors.contentBackground, flex: 1}}>
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}>
				<TouchableOpacity
					onPress={() =>
						setData(([week, day, table]) =>
							day > 1
								? [week, day - 1, table]
								: week > 1
								? [week - 1, 7, table]
								: [week, day, table],
						)
					}
					disabled={data[0] === 1 && data[1] === 1}>
					<IconLeft height={24} width={24} />
				</TouchableOpacity>
				<Text
					style={{
						fontSize: 16,
						marginHorizontal: 11,
						color: theme.colors.text,
					}}>
					{getStr("classroomHeaderPrefix") +
						data[0] +
						getStr("classroomHeaderMiddle") +
						getStr("dayOfWeek")[data[1]]}
				</Text>
				<TouchableOpacity
					onPress={() =>
						setData(([week, day, table]) =>
							day < 7
								? [week, day + 1, table]
								: week < weekCount
								? [week + 1, 1, table]
								: [week, day, table],
						)
					}
					disabled={data[0] === weekCount && data[1] === 7}>
					<IconRight height={24} width={24} />
				</TouchableOpacity>
			</View>
			<FlatList
				data={data[2]}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refresh}
						colors={[theme.colors.accent]}
					/>
				}
				style={{
					marginHorizontal: 16,
					marginTop: 27,
				}}
				ListHeaderComponent={
					<View
						style={{
							flexDirection: "row",
							marginBottom: 8,
						}}>
						<Text
							style={{
								flex: 3,
								fontSize: 14,
								color: theme.colors.fontB2,
							}}>
							{getStr("classroomName")}
						</Text>
						<View style={{flex: 1, marginRight: 41}}>
							<Text
								style={{
									textAlign: "center",
									fontSize: 14,
									color: theme.colors.fontB2,
								}}>
								{getStr("classroomCapacity")}
							</Text>
							<Text
								style={{
									textAlign: "center",
									fontSize: 11,
									marginTop: 4,
									color: theme.colors.fontB3,
								}}>
								（人）
							</Text>
						</View>
						<View style={{flex: 5}}>
							<Text
								style={{
									textAlign: "center",
									fontSize: 14,
									marginBottom: 4,
									color: theme.colors.fontB2,
								}}>
								{getStr("classroomCondition")}
							</Text>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}>
								{[1, 2, 3, 4, 5, 6].map((val) => (
									<Text
										key={val}
										style={{
											flex: 1,
											textAlign: "center",
											fontSize: 11,
											color:
												val >= currentPeriod
													? theme.colors.fontB1
													: theme.colors.fontB3,
										}}>
										{val}
									</Text>
								))}
							</View>
						</View>
					</View>
				}
				renderItem={({item}) => (
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
						}}>
						<Text
							style={{
								flex: 3,
								fontSize: 16,
								color: theme.colors.text,
							}}>
							{item[0].split(":")[0]}
						</Text>
						<Text
							style={{
								flex: 1,
								marginRight: 41,
								textAlign: "center",
								fontSize: 16,
								color: theme.colors.text,
							}}>
							{item[0].split(":")[1].replace("(人)", "")}
						</Text>
						<View style={{flex: 5, flexDirection: "row"}}>
							{Array.from(new Array(6)).map((_, index) => (
								<TouchableWithoutFeedback
									key={index}>
									<View
										style={{
											backgroundColor:
												item[1][(data[1] - 1) * 6 + index] === 5
													? index + 1 >= currentPeriod
														? theme.colors.themeDarkGrey
														: theme.colors.themeGrey
													: index + 1 >= currentPeriod
													? theme.colors.themePurple
													: theme.colors.themeTransparentPurple,
											flex: 1,
											height: 26,
											margin: 2,
										}}
									/>
								</TouchableWithoutFeedback>
							))}
						</View>
					</View>
				)}
				keyExtractor={(item, index) => item[0] + index}
			/>
		</View>
	);
};
