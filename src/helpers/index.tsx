export class Helpers {
	static get_object_by_name(name: string, items: object[]) {
		const target_item = items.find((item: any) => item.name === name);
		if (target_item) {
			return {target_item};
		}
		return undefined;
	}
}
