export interface Temp_Aggregate {
	id: number;
	fiber_id: number;
	time: string;
	max: number;
	min: number;
	avg: number;
	fiber_name: string;
	asset_id: number;
	start: number;
	end: number;
	capacity: number;
}

export interface Asset_Temp_Aggregate {
	asset_name: string | null;
	time: string | null;
	avg_temp_celsius: number | null;
}

export interface Fiber_Temp_Data {
	sensor_zone: string | null;
	time: string | null;
	avg_temp_celsius: number | null;
}

export interface Systems {
	id: number | null;
	name: string | null;
	latitude: number | null;
	longitude: number | null;
	region: string | null;
	number_of_assets: number | null;
}
