/*
instructionConvert.js

jsonデータを受け取って、テキストに変換する
*/

let instructionDict = null;

async function loadInstructionDictionary() {
    if (instructionDict) return instructionDict;

    const dictionaryUrl = "/navigation/static/json/navigationMessage.json";

    const res = await fetch(dictionaryUrl);
    /*
    jsonデータ
    maneuver:辞書型（turn-right:"右に曲がる"）
    keywords:辞書型のリスト（{match:text})
    */

    if (!res.ok) {
        console.error("ナビの読み込みに失敗しました", res.status)
        instructionDict = {
            maneuver: {},
            keywords: [],
            fallback: "案内に従って進む"
        }
        return instructionDict
    }

    instructionDict = await res.json();
    return instructionDict;
}

export async function stepToFriendly(step) {
    const dict = await loadInstructionDictionary();


    //jsonから受け取った各データを定義
    const manueverDict = dict.maneuver || {};
    const keywordsRule = dict.keywords || [];
    const fallback = dict.fallback || "案内に従って進む";


    //manueverDict[step.maneuver]があれば、取得
    if (step.maneuver && manueverDict[step.maneuver]) {
        return manueverDict[step.maneuver]
    }

    //なければ、HTMLタグを除去して取得
    let plain = (step.html_instructions || "")
        .replace(/<[^>]+>/g, "")
        .trim();

    
    //plainテキスト内の特定のキーワードを辞書を元に変換する
    for (const rule of keywordsRule) {
        plain = plain.replace(new RegExp(rule.match, "g"), rule.text);
    }


    // それでもよく分からない場合は、plainまたはfallbackを返す
    if (plain) {
        return plain;
    }

    return fallback;
}
