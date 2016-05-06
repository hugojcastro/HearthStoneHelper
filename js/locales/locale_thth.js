/*
 * This file is part of HearthStoneHelper.
 *
 * HearthStoneHelper is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * HearthStoneHelper is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with HearthStoneHelper.  If not, see <http://www.gnu.org/licenses/>.
 */
factions["thth"] = [ 'เป็นกลาง', 'วอริเออร์', 'พาลาดิน', 'ฮันเตอร์', 'โร้ก', 'พรีสต์', 'deathknight', 'ชาแมน', 'เมจ', 'วอร์ล็อค', 'monk', 'ดรูอิด' ];
races["thth"] = { 14: 'เมอร์ล็อค', 15: 'ปิศาจ', 17: 'เครื่องจักร', 20: 'สัตว์', 21: 'โทเท็ม', 23: 'โจรสลัด', 24: 'มังกร' };
texts["thth"] = {
	"test" : "test",
	"cardnotfound" : "ไม่พบบัตร!",
	"onlytwo" : "คุณไม่สามารถมีมากกว่าสอง '",
	"onlyone" : "คุณไม่สามารถมีมากกว่าหนึ่ง '",
	"urlerror" : "บางสิ่งบางอย่างผิดไปเมื่อแยก URL :(",
	"wrongurl" : "URL ไม่ถูกต้อง!",
	"nourl" : "URL ว่างเปล่า!",
	"importurlmsg" : "เขียนที่อยู่หรือหน้าดาดฟ้าของคุณและคลิกที่ปุ่ม",
	"importhtmlmsg" : "วางบน JTextArea ที่ข้อความ HTML ส่งออกและคลิกที่ปุ่ม",
	"savedeckmsg" : "เขียนชื่อสำหรับดาดฟ้าและคลิกที่ปุ่ม",
	"deckurl" : "ตกแต่ง URL ที่นี่",
	"decksaved" : "ประสบความสำเร็จในการจัดเก็บไว้ที่ดาดฟ้า",
	"loaddeckmsg" : "คลิกที่ชื่อดาดฟ้าที่เลือกที่จะโหลดมันหรือคลิกที่ปุ่มเพื่อลบมัน",
	"emptydecklist" : "รายการดาดฟ้าเป็นที่ว่างเปล่า",
	"errornodeck" : "ไม่พบดาดฟ้า!?",
	"errornoname" : "ไม่พบชื่อเด็ค!?",
	"errornohero" : "เด็คโดยไม่ต้องพบฮีโร่!?",
	"errornocards" : "ดาดฟ้าพบไม่มีบัตร!?",
	"errorbadimport" : "ข้อผิดพลาดเมื่อนำเข้าชั้น คุณกำลังใช้ไฟล์ที่ถูกต้อง?",
	"unnamed" : "ไม่มีชื่อ",
	"urlimporterror" : "ข้อผิดพลาดเมื่อนำเข้าจาก URL",
	"parseerror" : "ข้อผิดพลาดเมื่ออ่านจาก HTML (ที่คุณใช้เว็บไซต์ที่เหมาะสมหรือไม่)",
	"cardcounter" : "วาด",
	"exceptionthrown" : "ยกเว้นโยน: ",
	"unknownurl" : "ไม่รู้จัก Url",
	"emptyorinvalidhtml" : "ไม่มีเนื้อหา HTML ได้รับหรือแหล่งที่มาของมันไม่เป็นที่รู้จัก",
	"deckMissingCards" : "มีบัตรที่ขาดหายไปคือ:",
	"exportdecksmsg" : "ให้ชื่อไฟล์เพื่อส่งออกชั้น",
	"importdecksmsg" : "เลือกไฟล์ไปยังชั้นที่นำเข้าจาก",
	"jsonfilename" : "ชื่อเขียนไฟล์",
	"jsonerror" : "ชื่อไฟล์ที่ว่างเปล่าหรือไม่ถูกต้อง",
	"noexporterror" : "ไม่มีข้อมูลที่จะส่งออกชั้น!",
	"jsonexporterror" : "ไม่สามารถบันทึกไฟล์ :(",
	"restoredeck" : "การกู้คืนที่ดาดฟ้า",
	"deletedeck" : "ลบดาดฟ้า",
	"importexport" : "นำเข้าส่งออก",
	"loadsave" : "โหลด / บันทึก",
	"loaddeck" : "โหลดดาดฟ้า",
	"savedeck" : "บันทึกดาดฟ้า",
	"importdecks" : "นำเข้าหอ",
	"exportdecks" : "ส่งออกชั้น",
	"importfromurl" : "นำเข้าจาก URL",
	"importfromhtml" : "นำเข้าจาก HTML",
	"showhelp" : "แสดงความช่วยเหลือ",
	"cards" : "การ์ด",
	"importdeck" : "นำเข้าเด็ค",
	"savefile" : "บันทึกไฟล์",
	"loadbasic" : "โหลด Deck พื้นฐาน",
	"localeeses" : "Español (ES)",
	"localeengb" : "English (GB)",
	"localeenus" : "English (US)",
	"localeesla" : "Español (LA)",
	"localeitit" : "Italiano",
	"localefrfr" : "Français",
	"localedede" : "Deutsch",
	"localeptbr" : "Português",
	"localeruru" : "русский",
	"localeplpl" : "Polski",
	"localekokr" : "한국의",
	"localezhcn" : "普通話",
	"localezhtw" : "国语",
	"localejajp" : "日本語",
	"localethth" : "ภาษาไทย",
	"minion"     : "มินเนี่ยน",
	"spell"      : "คาถา",
	"weapon"     : "อาวุธ",
};
