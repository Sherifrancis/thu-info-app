import {store} from "../redux/store";
import {retrieve, stringify} from "./core";
import {
	HOLE_GET_COMMENTS_URL,
	HOLE_GET_LIST_URL,
	HOLE_LOGIN_URL,
	HOLE_NEW_COMMENT_URL,
	HOLE_NEW_POST_URL,
} from "../constants/strings";
import {FetchMode, HoleCommentCard, HoleTitleCard} from "../models/home/hole";

export const holeConfig = {
	foldTags: [
		"性相关",
		"政治相关",
		"折叠",
		"NSFW",
		"刷屏",
		"真实性可疑",
		"举报较多",
		"重复内容",
		"引战",
		"未经证实的传闻",
		"令人不适",
	],
	imageBase: "https://thimg.yecdn.com/",
};

const connect = (url: string, query?: object, post?: object): Promise<any> =>
	retrieve(
		url + "?" + stringify({...query, user_token: store.getState().hole.token}),
		undefined,
		post,
		"UTF-8",
		0,
		true,
	).then((s) => {
		const r = JSON.parse(s);
		if (r.code === 1) {
			throw r.msg;
		}
		return r;
	});

export const holeLogin = () =>
	connect(HOLE_LOGIN_URL).then((r: {error: any; result: []}) => {
		if (r.error) {
			throw new Error(r.error);
		} else if (r.result.length === 0) {
			throw new Error("Result check failed.");
		}
	});

export const getHoleList = async (
	mode: FetchMode,
	page: number,
	payload: string,
): Promise<HoleTitleCard[]> => {
	if (mode === FetchMode.SEARCH && payload.match(/#\d{1,7}/)) {
		return [];
	} else {
		const result = await connect(HOLE_GET_LIST_URL, {page});
		try {
			holeConfig.foldTags = result.config.fold_tags;
			holeConfig.imageBase = result.config.img_base_url;
		} catch (e) {}
		return result.data;
	}
};

export const getHoleDetail = async (
	pid: number,
): Promise<[HoleTitleCard, HoleCommentCard[]]> => {
	const result = await connect(HOLE_GET_COMMENTS_URL, {pid});
	return [result.post, result.data];
};

export const postNewHole = async (text: string): Promise<void> => {
	const result = await connect(
		HOLE_NEW_POST_URL,
		{},
		{
			text,
			type: "text",
			user_token: store.getState().hole.token,
		},
	);
	if (result.code !== 0) {
		throw new Error(result.message);
	}
};

export const postHoleComment = async (
	pid: number,
	text: string,
): Promise<void> => {
	const result = await connect(
		HOLE_NEW_COMMENT_URL,
		{},
		{
			pid,
			text,
			type: "text",
			user_token: store.getState().hole.token,
		},
	);
	if (result.code !== 0) {
		throw new Error(result.message);
	}
};
