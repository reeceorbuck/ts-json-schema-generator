export type Json =
	| string
	| number
	| boolean
	| null
	| { [property: string]: Json }
	| Json[];

export interface FormattedTextNodeCore {
	type: string;
	_id: string;
	_publicIndexable?: boolean;
	_excludeFromParentNode?: boolean;
	_linkedId?: string;
	_comment?: string;
}

export interface TextNodeReference {
	_id: string;
	_dataId: string;
	_childDataBucket: string;
	_consolidated: boolean;
	type: string;
}

export interface PermissionCore {
	parentId: string;
	childId: string;
	dataId: string;
	childDataBucket: string;
	referenceId: string | null;
	deleted?: boolean;
	indexTime?: string;
}

export interface PermissionComplete extends PermissionCore {
	createdTime: string;
	indexTime: string;
	deletedTime: string | null;
	readKey?: string | null;
	writeKey?: string | null;
	updatedTime: string;
}

export interface DataNodeCore {
	id: string;
	data: Json;
	deleted?: boolean;
}

export interface TimestampDataNode extends DataNodeCore {
	id: 'reinitializeTimestamp';
	data: {
		timestamp: string;
	};
}

export interface DataNodeComplete extends DataNodeCore {
	deletedTime: string | null;
	updateTime: Json;
	timestamp: string;
}
