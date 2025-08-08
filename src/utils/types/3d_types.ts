interface config_asset {
	id: number;
	name: string;
}

export default interface config {
	fibers: string[] | unknown;
	accessories: string[] | unknown;
	scale: number | null;
	asset: config_asset | unknown;
}
