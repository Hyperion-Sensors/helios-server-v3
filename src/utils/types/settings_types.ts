export interface settings {
	general: general;
	data_options: data_options;
}

export interface user_settings {
	settings: settings;
	saved_at: Date;
}

export interface general {
	Theme: string;
	Color_Blind_Mode: boolean;
	Side_Panel_Default: boolean;
}

export interface data_options {
	Pinned_Assets: string[];
	Favorite_Widgets: string[];
	Data_Refresh_Rate: number;
	Unit_System: string;
}
