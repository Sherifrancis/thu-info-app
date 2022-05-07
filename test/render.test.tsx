import "react-native";
import React from "react";
import {App} from "../src/App";
import renderer from "react-test-renderer";

jest.setTimeout(30000);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

it("renders correctly", async () => {
	// Render the app
	const {root} = renderer.create(<App />);

	// Perform login
	root.findByProps({testID: "loginUserId"}).props.onChangeText("8888");
	root.findByProps({testID: "loginPassword"}).props.onChangeText("8888");
	root.findByProps({testID: "loginButton"}).props.onPress();
	await sleep(3000);

	// Test top5
	const top5Recently = root.findByProps({
		testID: "homeFunctions-recentlyUsedFunction",
	}).children[0];
	const top5All = root.findByProps({
		testID: "homeFunctions-allFunction",
	}).children[0];
	expect(typeof top5Recently === "string").toBeFalsy();
	expect(typeof top5All === "string").toBeFalsy();
	if (typeof top5Recently === "string" || typeof top5All === "string") {
		return;
	}
	expect(top5Recently.children.length).toEqual(0);
	expect(top5All.children.length).toBeGreaterThan(0);

	// Press a home page function
	root.findByProps({title: "report"}).props.onPress();
	await sleep(3000);
	expect(top5Recently.children.length).toEqual(1);
	await sleep(10000);
});
