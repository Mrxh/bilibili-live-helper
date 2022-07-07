import type { Component } from "vue";

export type Hash = "/" | "/settings" | "/fans" | "/music" | "/prompt";

interface WindowSize {
	width: number;
	height: number;
}

export type QueryDataArgs = {
	method?: "get" | "post";
	params?: Record<string, any>;
	option?: Record<string, any>;
	returnErrorResult?: boolean;
};

export type SendMessage = {
	msg: string;
	dm_type?: number;
	isInitiative?: boolean;
};

export interface UserItem {
	uid: string;
	face: string;
	sex: string;
	relation?: number;
}

export interface BarrageItem {
	id: string;
	barrage: any;
	barrageType: "general" | "gift" | "action";
}

export interface OperateIconItem {
	title: string;
	active?: boolean;
	component: string | Component;
	clickEvent: () => void;
}

export interface HelperSettingsTabItem {
	key: number;
	title: string;
	subTitle?: string;
	icon: string;
	isAnchor?: boolean;
	component: Component;
}

export interface ToolsItem {
	key?: string;
	title: string;
	description: string;
	isOpen?: boolean;
	hash?: Hash;
}

export interface connectItem {
	label: string;
	value: string;
	href?: string;
}

export interface AccountInfoForm {
	uid?: string;
	csrf?: string;
	cookie?: string;
}

export interface AccountInfoFormItem {
	label: string;
	field: keyof AccountInfoForm;
	required: boolean;
	component: string;
}

export interface GiftInfo {
	name: string;
	action1: string;
	action2?: string = "";
	gift1?: string = "";
	gift2: string;
	gift2Id: string;
	number: string;
}

export interface HighInfo {
	prefix: string;
	name: string;
	suffix: string;
}

export interface BarrageMedal {
	name: string;
	level: string;
	color: string;
	borderColor: string;
	bgStartColor: string;
	bgEndColor: string;
}

export interface NewVideoInfo {
	fans: number;
	face: string;
	name: string;
	title: string;
	view: number;
	like: number;
	coin: number;
	favorite: number;
	share: number;
	reply: number;
	danmaku: number;
}
