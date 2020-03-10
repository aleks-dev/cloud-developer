import { Memo } from "./Memo";
import { Explanation } from "elasticsearch";

export interface ElasticSearchHit {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: Memo;
    _version?: number;
    _explanation?: Explanation;
    fields?: any;
    highlight?: any;
    inner_hits?: any;
    matched_queries?: string[];
    sort?: string[];
}