import type { Region, IRegion, IRealm } from '../types';

export const regions: IRegion[] = [
  {
    value: 'CN',
    label: 'China'
  },
  { value: 'EU', label: 'Europe' },
  { value: 'KR', label: 'Korean' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'US', label: 'United States' }
];

export const realms: Record<Region, IRealm[]> = {
  CN: [
    { value: 'connected-silver-hand', label: '白银之手 ' },
    { value: 'connected-echo-ridge', label: '回音山 ' },
    { value: 'connected-danath-trollbane', label: '达纳斯 ' },
    { value: 'connected-valley-of-kings', label: '国王之谷 ' },
    { value: 'connected-rhonin', label: '罗宁 ' },
    { value: 'connected-deathwing', label: '死亡之翼 ' },
    { value: 'connected-bronze-dragonflight', label: '铜龙军团 ' },
    { value: 'connected-shadowmoon', label: '暗影之月 ' },
    { value: 'connected-temple-of-elune', label: '月神殿 ' },
    { value: 'connected-ravencrest', label: '拉文凯斯 ' },
    { value: 'connected-the-masters-glaive', label: '主宰之剑 ' },
    { value: 'connected-eldrethalas', label: '埃德萨拉 ' },
    { value: 'connected-thunder-axe-fortress', label: '雷斧堡垒 ' },
    { value: 'connected-bleeding-hollow', label: '血环 ' },
    { value: 'connected-rexxar', label: '雷克萨 ' },
    { value: 'connected-proudmoore', label: '普罗德摩 ' },
    { value: 'connected-burning-blade', label: '燃烧之刃 ' },
    { value: 'connected-pandaren', label: '熊猫酒仙 ' },
    { value: 'connected-alterac-mountains', label: '奥特兰克 ' },
    { value: 'connected-chillwind-point', label: '冰风岗 ' },
    { value: 'connected-icecrown', label: '寒冰皇冠 ' },
    { value: 'connected-kelthuzad', label: '克尔苏加德 ' },
    { value: 'connected-scarlet-crusade', label: '血色十字军 ' },
    { value: 'connected-shadowfang-keep', label: '影牙要塞 ' },
    { value: 'connected-blanchard', label: '布兰卡德 ' },
    { value: 'connected-holy-chanter', label: '神圣之歌 ' },
    { value: 'connected-storm-eye', label: '风暴之眼 ' },
    { value: 'connected-the-golden-plains', label: '金色平原 ' },
    { value: 'connected-crushridge', label: '破碎岭 ' },
    { value: 'connected-hydraxis', label: '海达希亚 ' },
    { value: 'connected-grim-batol', label: '格瑞姆巴托 ' },
    { value: 'connected-the-great-sea', label: '无尽之海 ' },
    { value: 'connected-well-of-eternity', label: '永恒之井 ' },
    { value: 'connected-brann', label: '布莱恩 ' },
    { value: 'connected-dark-iron', label: '黑铁 ' },
    { value: 'connected-theramore', label: '塞拉摩 ' },
    { value: 'connected-argus', label: '阿古斯 ' },
    { value: 'connected-alar', label: '凤凰之神 ' },
    { value: 'connected-emerald-dream', label: '翡翠梦境 ' },
    { value: 'connected-barrens', label: '贫瘠之地 ' },
    { value: 'connected-anzu', label: '安苏 ' },
    { value: 'connected-hearthglen', label: '壁炉谷 ' },
    { value: 'connected-doomwalker', label: '末日行者 ' },
    { value: 'connected-the-mechanar', label: '能源舰 ' },
    { value: 'connected-galakrond', label: '迦拉克隆 ' },
    { value: 'connected-draktharon', label: '达克萨隆 ' },
    { value: 'connected-deathwhisper', label: '亡语者 ' },
    { value: 'connected-shadowmourne', label: '影之哀伤 ' }
  ],
  EU: [
    { value: 'connected-silvermoon', label: 'Silvermoon' },
    { value: 'connected-draenor', label: 'Draenor' },
    { value: 'connected-dentarg', label: 'Dentarg' },
    { value: 'connected-tarren-mill', label: 'Tarren Mill' },
    { value: 'connected-kazzak', label: 'Kazzak' },
    { value: 'connected-blackhand', label: 'Blackhand' },
    { value: 'connected-echsenkessel', label: 'Echsenkessel' },
    { value: 'connected-malganis', label: "Mal'Ganis" },
    { value: 'connected-taerar', label: 'Taerar' },
    { value: 'connected-twisting-nether', label: 'Twisting Nether' },
    { value: 'connected-hyjal', label: 'Hyjal' },
    { value: 'connected-blackmoore', label: 'Blackmoore' },
    { value: 'connected-lordaeron', label: 'Lordaeron' },
    { value: 'connected-tichondrius', label: 'Tichondrius' },
    { value: 'connected-argent-dawn', label: 'Argent Dawn' },
    { value: 'connected-ravencrest', label: 'Ravencrest' },
    { value: 'connected-antonidas', label: 'Antonidas' },
    { value: 'connected-sanguino', label: 'Sanguino' },
    { value: 'connected-shendralar', label: "Shen'dralar" },
    { value: 'connected-uldum', label: 'Uldum' },
    { value: 'connected-zuljin', label: "Zul'jin" },
    { value: 'connected-howling-fjord', label: 'Ревущий фьорд ' },
    { value: 'connected-gordunni', label: 'Гордунни ' },
    { value: 'connected-blackrock', label: 'Blackrock' },
    { value: 'connected-ragnaros', label: 'Ragnaros' },
    { value: 'connected-ambossar', label: 'Ambossar' },
    { value: 'connected-kargath', label: 'Kargath' },
    { value: 'connected-thrall', label: 'Thrall' },
    { value: 'connected-chogall', label: "Cho'gall" },
    { value: 'connected-dalaran', label: 'Dalaran' },
    { value: 'connected-eldrethalas', label: "Eldre'Thalas" },
    { value: 'connected-marécage-de-zangar', label: 'Marécage de Zangar' },
    { value: 'connected-sinstralis', label: 'Sinstralis' },
    { value: 'connected-burning-blade', label: 'Burning Blade' },
    { value: 'connected-drakthul', label: "Drak'thul" },
    { value: 'connected-stormscale', label: 'Stormscale' },
    { value: 'connected-doomhammer', label: 'Doomhammer' },
    { value: 'connected-turalyon', label: 'Turalyon' },
    { value: 'connected-alakir', label: "Al'Akir" },
    { value: 'connected-burning-legion', label: 'Burning Legion' },
    { value: 'connected-skullcrusher', label: 'Skullcrusher' },
    { value: 'connected-xavius', label: 'Xavius' },
    { value: 'connected-archimonde', label: 'Archimonde' },
    {
      value: 'connected-confrérie-du-thorium',
      label: 'Confrérie du Thorium'
    },
    { value: 'connected-conseil-des-ombres', label: 'Conseil des Ombres' },
    {
      value: 'connected-culte-de-la-rive-noire',
      label: 'Culte de la Rive noire'
    },
    { value: 'connected-kirin-tor', label: 'Kirin Tor' },
    {
      value: 'connected-la-croisade-écarlate',
      label: 'La Croisade écarlate'
    },
    { value: 'connected-les-clairvoyants', label: 'Les Clairvoyants' },
    { value: 'connected-les-sentinelles', label: 'Les Sentinelles' },
    { value: 'connected-eredar', label: 'Eredar' },
    { value: 'connected-auchindoun', label: 'Auchindoun' },
    { value: 'connected-dunemaul', label: 'Dunemaul' },
    { value: 'connected-jaedenar', label: 'Jaedenar' },
    { value: 'connected-sylvanas', label: 'Sylvanas' },
    { value: 'connected-cthun', label: "C'Thun" },
    { value: 'connected-dun-modr', label: 'Dun Modr' },
    { value: 'connected-ysondre', label: 'Ysondre' },
    { value: 'connected-soulflayer', label: 'Свежеватель Душ ' },
    { value: 'connected-arathor', label: 'Arathor' },
    { value: 'connected-hellfire', label: 'Hellfire' },
    { value: 'connected-kilrogg', label: 'Kilrogg' },
    { value: 'connected-nagrand', label: 'Nagrand' },
    { value: 'connected-runetotem', label: 'Runetotem' },
    { value: 'connected-darkmoon-faire', label: 'Darkmoon Faire' },
    { value: 'connected-defias-brotherhood', label: 'Defias Brotherhood' },
    { value: 'connected-earthen-ring', label: 'Earthen Ring' },
    { value: 'connected-ravenholdt', label: 'Ravenholdt' },
    { value: 'connected-scarshield-legion', label: 'Scarshield Legion' },
    { value: 'connected-sporeggar', label: 'Sporeggar' },
    { value: 'connected-the-venture-co', label: 'The Venture Co' },
    { value: 'connected-dun-morogh', label: 'Dun Morogh' },
    { value: 'connected-norgannon', label: 'Norgannon' },
    { value: 'connected-garrosh', label: 'Garrosh' },
    { value: 'connected-nozdormu', label: 'Nozdormu' },
    { value: 'connected-perenolde', label: 'Perenolde' },
    { value: 'connected-shattrath', label: 'Shattrath' },
    { value: 'connected-teldrassil', label: 'Teldrassil' },
    { value: 'connected-der-mithrilorden', label: 'Der Mithrilorden' },
    {
      value: 'connected-der-rat-von-dalaran',
      label: 'Der Rat von Dalaran'
    },
    { value: 'connected-die-nachtwache', label: 'Die Nachtwache' },
    { value: 'connected-forscherliga', label: 'Forscherliga' },
    { value: 'connected-todeswache', label: 'Todeswache' },
    {
      value: 'connected-zirkel-des-cenarius',
      label: 'Zirkel des Cenarius'
    },
    { value: 'connected-outland', label: 'Outland' },
    { value: 'connected-aggra-português', label: 'Aggra (Português)' },
    { value: 'connected-frostmane', label: 'Frostmane' },
    { value: 'connected-grim-batol', label: 'Grim Batol' },
    { value: 'connected-bloodfeather', label: 'Bloodfeather' },
    { value: 'connected-burning-steppes', label: 'Burning Steppes' },
    { value: 'connected-darkspear', label: 'Darkspear' },
    { value: 'connected-executus', label: 'Executus' },
    { value: 'connected-korgall', label: "Kor'gall" },
    { value: 'connected-saurfang', label: 'Saurfang' },
    { value: 'connected-shattered-hand', label: 'Shattered Hand' },
    { value: 'connected-terokkar', label: 'Terokkar' },
    { value: 'connected-deathwing', label: 'Deathwing' },
    { value: 'connected-dragonblight', label: 'Dragonblight' },
    { value: 'connected-ghostlands', label: 'Ghostlands' },
    { value: 'connected-karazhan', label: 'Karazhan' },
    { value: 'connected-lightnings-blade', label: "Lightning's Blade" },
    { value: 'connected-the-maelstrom', label: 'The Maelstrom' },
    { value: 'connected-khaz-modan', label: 'Khaz Modan' },
    { value: 'connected-azjolnerub', label: 'Azjol-Nerub' },
    { value: 'connected-quelthalas', label: "Quel'Thalas" },
    { value: 'connected-arthas', label: 'Arthas' },
    { value: 'connected-blutkessel', label: 'Blutkessel' },
    { value: 'connected-durotan', label: 'Durotan' },
    { value: 'connected-kelthuzad', label: "Kel'Thuzad" },
    { value: 'connected-tirion', label: 'Tirion' },
    { value: 'connected-veklor', label: "Vek'lor" },
    { value: 'connected-wrathbringer', label: 'Wrathbringer' },
    { value: 'connected-alexstrasza', label: 'Alexstrasza' },
    { value: 'connected-madmortem', label: 'Madmortem' },
    { value: 'connected-nethersturm', label: 'Nethersturm' },
    { value: 'connected-proudmoore', label: 'Proudmoore' },
    { value: 'connected-aerie-peak', label: 'Aerie Peak' },
    { value: 'connected-blades-edge', label: "Blade's Edge" },
    { value: 'connected-bronzebeard', label: 'Bronzebeard' },
    { value: 'connected-eonar', label: 'Eonar' },
    { value: 'connected-veknilash', label: "Vek'nilash" },
    { value: 'connected-amanthul', label: "Aman'thul" },
    { value: 'connected-anubarak', label: "Anub'arak" },
    { value: 'connected-dalvengyr', label: 'Dalvengyr' },
    { value: 'connected-frostmourne', label: 'Frostmourne' },
    { value: 'connected-nazjatar', label: 'Nazjatar' },
    { value: 'connected-zuluhed', label: 'Zuluhed' },
    { value: 'connected-alleria', label: 'Alleria' },
    { value: 'connected-rexxar', label: 'Rexxar' },
    { value: 'connected-destromath', label: 'Destromath' },
    { value: 'connected-gilneas', label: 'Gilneas' },
    { value: 'connected-gorgonnash', label: 'Gorgonnash' },
    { value: 'connected-mannoroth', label: 'Mannoroth' },
    { value: 'connected-nefarian', label: 'Nefarian' },
    { value: 'connected-nerathor', label: "Nera'thor" },
    { value: 'connected-ulduar', label: 'Ulduar' },
    { value: 'connected-das-konsortium', label: 'Das Konsortium' },
    { value: 'connected-das-syndikat', label: 'Das Syndikat' },
    { value: 'connected-der-abyssische-rat', label: 'Der Abyssische Rat' },
    { value: 'connected-die-arguswacht', label: 'Die Arguswacht' },
    { value: 'connected-die-silberne-hand', label: 'Die Silberne Hand' },
    { value: 'connected-die-todeskrallen', label: 'Die Todeskrallen' },
    { value: 'connected-die-ewige-wacht', label: 'Die ewige Wacht' },
    {
      value: 'connected-kult-der-verdammten',
      label: 'Kult der Verdammten'
    },
    { value: 'connected-blackscar', label: 'Черный Шрам ' },
    { value: 'connected-booty-bay', label: 'Пиратская Бухта ' },
    { value: 'connected-borean-tundra', label: 'Борейская тундра ' },
    { value: 'connected-deathweaver', label: 'Ткач Смерти ' },
    { value: 'connected-grom', label: 'Гром ' },
    { value: 'connected-thermaplugg', label: 'Термоштепсель ' },
    { value: 'connected-nemesis', label: 'Nemesis' },
    { value: 'connected-drekthar', label: "Drek'Thar" },
    { value: 'connected-eitrigg', label: 'Eitrigg' },
    { value: 'connected-krasus', label: 'Krasus' },
    { value: 'connected-uldaman', label: 'Uldaman' },
    { value: 'connected-malfurion', label: 'Malfurion' },
    { value: 'connected-malygos', label: 'Malygos' },
    { value: 'connected-pozzo-delleternità', label: "Pozzo dell'Eternità" },
    { value: 'connected-magtheridon', label: 'Magtheridon' },
    { value: 'connected-azshara', label: 'Azshara' },
    { value: 'connected-baelgun', label: 'Baelgun' },
    { value: 'connected-kragjin', label: "Krag'jin" },
    { value: 'connected-lothar', label: 'Lothar' },
    { value: 'connected-elune', label: 'Elune' },
    { value: 'connected-varimathras', label: 'Varimathras' },
    { value: 'connected-colinas-pardas', label: 'Colinas Pardas' },
    { value: 'connected-los-errantes', label: 'Los Errantes' },
    { value: 'connected-tyrande', label: 'Tyrande' },
    { value: 'connected-dragonmaw', label: 'Dragonmaw' },
    { value: 'connected-haomarush', label: 'Haomarush' },
    { value: 'connected-spinebreaker', label: 'Spinebreaker' },
    { value: 'connected-stormreaver', label: 'Stormreaver' },
    { value: 'connected-vashj', label: 'Vashj' },
    { value: 'connected-frostwolf', label: 'Frostwolf' },
    { value: 'connected-bladefist', label: 'Bladefist' },
    { value: 'connected-darksorrow', label: 'Darksorrow' },
    { value: 'connected-frostwhisper', label: 'Frostwhisper' },
    { value: 'connected-genjuros', label: 'Genjuros' },
    { value: 'connected-neptulon', label: 'Neptulon' },
    { value: 'connected-zenedar', label: 'Zenedar' },
    { value: 'connected-ahnqiraj', label: "Ahn'Qiraj" },
    { value: 'connected-balnazzar', label: 'Balnazzar' },
    { value: 'connected-boulderfist', label: 'Boulderfist' },
    { value: 'connected-chromaggus', label: 'Chromaggus' },
    { value: 'connected-daggerspine', label: 'Daggerspine' },
    { value: 'connected-laughing-skull', label: 'Laughing Skull' },
    { value: 'connected-shattered-halls', label: 'Shattered Halls' },
    { value: 'connected-sunstrider', label: 'Sunstrider' },
    { value: 'connected-talnivarr', label: 'Talnivarr' },
    { value: 'connected-trollbane', label: 'Trollbane' },
    { value: 'connected-die-aldor', label: 'Die Aldor' },
    { value: 'connected-aegwynn', label: 'Aegwynn' },
    { value: 'connected-eversong', label: 'Вечная Песня ' },
    { value: 'connected-exodar', label: 'Exodar' },
    { value: 'connected-minahonda', label: 'Minahonda' },
    { value: 'connected-emerald-dream', label: 'Emerald Dream' },
    { value: 'connected-terenas', label: 'Terenas' },
    { value: 'connected-moonglade', label: 'Moonglade' },
    {
      value: 'connected-steamwheedle-cartel',
      label: 'Steamwheedle Cartel'
    },
    { value: 'connected-the-shatar', label: "The Sha'tar" },
    { value: 'connected-thunderhorn', label: 'Thunderhorn' },
    { value: 'connected-wildhammer', label: 'Wildhammer' },
    { value: 'connected-area-52', label: 'Area 52' },
    { value: 'connected-senjin', label: "Sen'jin" },
    { value: 'connected-ungoro', label: "Un'Goro" },
    { value: 'connected-aszune', label: 'Aszune' },
    { value: 'connected-shadowsong', label: 'Shadowsong' },
    { value: 'connected-chamber-of-aspects', label: 'Chamber of Aspects' },
    { value: 'connected-aggramar', label: 'Aggramar' },
    { value: 'connected-hellscream', label: 'Hellscream' },
    { value: 'connected-anetheron', label: 'Anetheron' },
    { value: 'connected-festung-der-stürme', label: 'Festung der Stürme' },
    { value: 'connected-guldan', label: "Gul'dan" },
    { value: 'connected-kiljaeden', label: "Kil'jaeden" },
    { value: 'connected-nathrezim', label: 'Nathrezim' },
    { value: 'connected-rajaxx', label: 'Rajaxx' },
    { value: 'connected-arygos', label: 'Arygos' },
    { value: 'connected-khazgoroth', label: "Khaz'goroth" },
    { value: 'connected-malorne', label: 'Malorne' },
    { value: 'connected-ysera', label: 'Ysera' },
    { value: 'connected-garona', label: 'Garona' },
    { value: 'connected-nerzhul', label: "Ner'zhul" },
    { value: 'connected-sargeras', label: 'Sargeras' },
    { value: 'connected-alonsus', label: 'Alonsus' },
    { value: 'connected-anachronos', label: 'Anachronos' },
    { value: 'connected-kul-tiras', label: 'Kul Tiras' },
    { value: 'connected-deepholm', label: 'Подземье ' },
    { value: 'connected-galakrond', label: 'Галакронд ' },
    { value: 'connected-razuvious', label: 'Разувий ' },
    { value: 'connected-dethecus', label: 'Dethecus' },
    { value: 'connected-mugthol', label: "Mug'thol" },
    { value: 'connected-onyxia', label: 'Onyxia' },
    { value: 'connected-terrordar', label: 'Terrordar' },
    { value: 'connected-theradras', label: 'Theradras' },
    { value: 'connected-azuremyst', label: 'Azuremyst' },
    { value: 'connected-stormrage', label: 'Stormrage' },
    { value: 'connected-arakarahm', label: 'Arak-arahm' },
    { value: 'connected-kaelthas', label: "Kael'thas" },
    { value: 'connected-rashgarroth', label: 'Rashgarroth' },
    { value: 'connected-throkferoth', label: "Throk'Feroth" },
    {
      value: 'connected-bronze-dragonflight',
      label: 'Bronze Dragonflight'
    },
    { value: 'connected-nordrassil', label: 'Nordrassil' },
    { value: 'connected-agamaggan', label: 'Agamaggan' },
    { value: 'connected-bloodscalp', label: 'Bloodscalp' },
    { value: 'connected-crushridge', label: 'Crushridge' },
    { value: 'connected-emeriss', label: 'Emeriss' },
    { value: 'connected-hakkar', label: 'Hakkar' },
    { value: 'connected-twilights-hammer', label: "Twilight's Hammer" },
    { value: 'connected-chants-éternels', label: 'Chants éternels' },
    { value: 'connected-voljin', label: "Vol'jin" },
    { value: 'connected-lightbringer', label: 'Lightbringer' },
    { value: 'connected-mazrigos', label: 'Mazrigos' },
    { value: 'connected-bloodhoof', label: 'Bloodhoof' },
    { value: 'connected-khadgar', label: 'Khadgar' },
    { value: 'connected-goldrinn', label: 'Голдринн ' },
    { value: 'connected-greymane', label: 'Седогрив ' },
    { value: 'connected-lich-king', label: 'Король-лич ' },
    { value: 'connected-medivh', label: 'Medivh' },
    { value: 'connected-suramar', label: 'Suramar' },
    { value: 'connected-arathi', label: 'Arathi' },
    { value: 'connected-illidan', label: 'Illidan' },
    { value: 'connected-naxxramas', label: 'Naxxramas' },
    { value: 'connected-temple-noir', label: 'Temple noir' },
    { value: 'connected-fordragon', label: 'Дракономор ' },
    { value: 'connected-azuregos', label: 'Азурегос ' },
    { value: 'connected-ashenvale', label: 'Ясеневый лес ' },
    { value: 'connected-deathguard', label: 'Страж Смерти ' }
  ],
  KR: [
    { value: 'connected-azshara', label: '아즈샤라 ' },
    { value: 'connected-cenarius', label: '세나리우스 ' },
    { value: 'connected-dalaran', label: '달라란 ' },
    { value: 'connected-garona', label: '가로나 ' },
    { value: 'connected-guldan', label: '굴단 ' },
    { value: 'connected-hellscream', label: '헬스크림 ' },
    { value: 'connected-hyjal', label: '하이잘 ' },
    { value: 'connected-malfurion', label: '말퓨리온 ' },
    { value: 'connected-norgannon', label: '노르간논 ' },
    { value: 'connected-zuljin', label: '줄진 ' },
    { value: 'connected-alexstrasza', label: '알렉스트라자 ' },
    { value: 'connected-deathwing', label: '데스윙 ' },
    { value: 'connected-rexxar', label: '렉사르 ' },
    { value: 'connected-wildhammer', label: '와일드해머 ' },
    { value: 'connected-windrunner', label: '윈드러너 ' },
    { value: 'connected-burning-legion', label: '불타는 군단 ' },
    { value: 'connected-durotan', label: '듀로탄 ' },
    { value: 'connected-stormrage', label: '스톰레이지 ' }
  ],
  TW: [
    { value: 'connected-arygos', label: '亞雷戈斯 ' },
    { value: 'connected-bleeding-hollow', label: '血之谷 ' },
    { value: 'connected-dragonmaw', label: '巨龍之喉 ' },
    { value: 'connected-frostmane', label: '冰霜之刺 ' },
    { value: 'connected-menethil', label: '米奈希爾 ' },
    { value: 'connected-nightsong', label: '夜空之歌 ' },
    { value: 'connected-order-of-the-cloud-serpent', label: '雲蛟衛 ' },
    { value: 'connected-stormscale', label: '雷鱗 ' },
    { value: 'connected-world-tree', label: '世界之樹 ' },
    { value: 'connected-crystalpine-stinger', label: '水晶之刺 ' },
    { value: 'connected-demon-fall-canyon', label: '屠魔山谷 ' },
    { value: 'connected-lights-hope', label: '聖光之願 ' },
    { value: 'connected-silverwing-hold', label: '銀翼要塞 ' },
    { value: 'connected-skywall', label: '天空之牆 ' },
    { value: 'connected-sundown-marsh', label: '日落沼澤 ' },
    { value: 'connected-wrathbringer', label: '憤怒使者 ' },
    { value: 'connected-arthas', label: '阿薩斯 ' },
    { value: 'connected-chillwind-point', label: '冰風崗哨 ' },
    { value: 'connected-hellscream', label: '地獄吼 ' },
    { value: 'connected-icecrown', label: '寒冰皇冠 ' },
    { value: 'connected-queldorei', label: '眾星之子 ' },
    { value: 'connected-shadowmoon', label: '暗影之月 ' },
    { value: 'connected-spirestone', label: '尖石 ' },
    { value: 'connected-whisperwind', label: '語風 ' },
    { value: 'connected-zealot-blade', label: '狂熱之刃 ' },
    { value: 'connected-krol-blade', label: '克羅之刃 ' },
    { value: 'connected-old-blanchy', label: '老馬布蘭契 ' }
  ],
  US: [
    { value: 'connected-area-52', label: 'Area 52' },
    { value: 'connected-stormrage', label: 'Stormrage' },
    { value: 'connected-illidan', label: 'Illidan' },
    { value: 'connected-tichondrius', label: 'Tichondrius' },
    { value: 'connected-moon-guard', label: 'Moon Guard' },
    { value: 'connected-dreadmaul', label: 'Dreadmaul' },
    { value: 'connected-frostmourne', label: 'Frostmourne' },
    { value: 'connected-gundrak', label: 'Gundrak' },
    { value: 'connected-jubeithos', label: "Jubei'Thos" },
    { value: 'connected-thaurissan', label: 'Thaurissan' },
    { value: 'connected-sargeras', label: 'Sargeras' },
    { value: 'connected-thrall', label: 'Thrall' },
    { value: 'connected-azralon', label: 'Azralon' },
    { value: 'connected-zuljin', label: "Zul'jin" },
    { value: 'connected-ragnaros', label: 'Ragnaros' },
    { value: 'connected-proudmoore', label: 'Proudmoore' },
    { value: 'connected-quelthalas', label: "Quel'Thalas" },
    { value: 'connected-malganis', label: "Mal'Ganis" },
    { value: 'connected-dalaran', label: 'Dalaran' },
    { value: 'connected-aegwynn', label: 'Aegwynn' },
    { value: 'connected-bonechewer', label: 'Bonechewer' },
    { value: 'connected-daggerspine', label: 'Daggerspine' },
    { value: 'connected-garrosh', label: 'Garrosh' },
    { value: 'connected-gurubashi', label: 'Gurubashi' },
    { value: 'connected-hakkar', label: 'Hakkar' },
    { value: 'connected-azgalor', label: 'Azgalor' },
    { value: 'connected-azshara', label: 'Azshara' },
    { value: 'connected-blood-furnace', label: 'Blood Furnace' },
    { value: 'connected-destromath', label: 'Destromath' },
    { value: 'connected-mannoroth', label: 'Mannoroth' },
    { value: 'connected-nazjatar', label: 'Nazjatar' },
    { value: 'connected-thunderlord', label: 'Thunderlord' },
    { value: 'connected-wyrmrest-accord', label: 'Wyrmrest Accord' },
    { value: 'connected-ghostlands', label: 'Ghostlands' },
    { value: 'connected-gnomeregan', label: 'Gnomeregan' },
    { value: 'connected-grizzly-hills', label: 'Grizzly Hills' },
    { value: 'connected-kaelthas', label: "Kael'thas" },
    { value: 'connected-lothar', label: 'Lothar' },
    { value: 'connected-malfurion', label: 'Malfurion' },
    { value: 'connected-moonrunner', label: 'Moonrunner' },
    { value: 'connected-trollbane', label: 'Trollbane' },
    { value: 'connected-borean-tundra', label: 'Borean Tundra' },
    { value: 'connected-drakthul', label: "Drak'thul" },
    { value: 'connected-hydraxis', label: 'Hydraxis' },
    { value: 'connected-moknathal', label: "Mok'Nathal" },
    { value: 'connected-shadowsong', label: 'Shadowsong' },
    { value: 'connected-silvermoon', label: 'Silvermoon' },
    { value: 'connected-skywall', label: 'Skywall' },
    { value: 'connected-terenas', label: 'Terenas' },
    { value: 'connected-bleeding-hollow', label: 'Bleeding Hollow' },
    { value: 'connected-agamaggan', label: 'Agamaggan' },
    { value: 'connected-archimonde', label: 'Archimonde' },
    { value: 'connected-blades-edge', label: "Blade's Edge" },
    { value: 'connected-burning-legion', label: 'Burning Legion' },
    { value: 'connected-jaedenar', label: 'Jaedenar' },
    { value: 'connected-kargath', label: 'Kargath' },
    { value: 'connected-norgannon', label: 'Norgannon' },
    { value: 'connected-the-underbog', label: 'The Underbog' },
    { value: 'connected-thunderhorn', label: 'Thunderhorn' },
    { value: 'connected-burning-blade', label: 'Burning Blade' },
    { value: 'connected-garona', label: 'Garona' },
    { value: 'connected-icecrown', label: 'Icecrown' },
    { value: 'connected-lightnings-blade', label: "Lightning's Blade" },
    { value: 'connected-malygos', label: 'Malygos' },
    { value: 'connected-onyxia', label: 'Onyxia' },
    { value: 'connected-caelestrasz', label: 'Caelestrasz' },
    { value: 'connected-nagrand', label: 'Nagrand' },
    { value: 'connected-saurfang', label: 'Saurfang' },
    { value: 'connected-cairne', label: 'Cairne' },
    { value: 'connected-cenarius', label: 'Cenarius' },
    { value: 'connected-frostmane', label: 'Frostmane' },
    { value: 'connected-korgath', label: 'Korgath' },
    { value: 'connected-nerzhul', label: "Ner'zhul" },
    { value: 'connected-perenolde', label: 'Perenolde' },
    { value: 'connected-tortheldrin', label: 'Tortheldrin' },
    { value: 'connected-barthilas', label: 'Barthilas' },
    { value: 'connected-emerald-dream', label: 'Emerald Dream' },
    { value: 'connected-akama', label: 'Akama' },
    { value: 'connected-antonidas', label: 'Antonidas' },
    { value: 'connected-dragonmaw', label: 'Dragonmaw' },
    { value: 'connected-eldrethalas', label: "Eldre'Thalas" },
    { value: 'connected-korialstrasz', label: 'Korialstrasz' },
    { value: 'connected-mugthol', label: "Mug'thol" },
    { value: 'connected-uldum', label: 'Uldum' },
    { value: 'connected-amanthul', label: "Aman'Thul" },
    { value: 'connected-dathremar', label: "Dath'Remar" },
    { value: 'connected-khazgoroth', label: "Khaz'goroth" },
    { value: 'connected-andorhal', label: 'Andorhal' },
    { value: 'connected-black-dragonflight', label: 'Black Dragonflight' },
    { value: 'connected-eonar', label: 'Eonar' },
    { value: 'connected-guldan', label: "Gul'dan" },
    { value: 'connected-scilla', label: 'Scilla' },
    { value: 'connected-skullcrusher', label: 'Skullcrusher' },
    { value: 'connected-ursin', label: 'Ursin' },
    { value: 'connected-velen', label: 'Velen' },
    { value: 'connected-zuluhed', label: 'Zuluhed' },
    { value: 'connected-kelthuzad', label: "Kel'Thuzad" },
    { value: 'connected-azjolnerub', label: 'Azjol-Nerub' },
    { value: 'connected-blackrock', label: 'Blackrock' },
    { value: 'connected-khaz-modan', label: 'Khaz Modan' },
    { value: 'connected-muradin', label: 'Muradin' },
    { value: 'connected-nordrassil', label: 'Nordrassil' },
    { value: 'connected-bloodscalp', label: 'Bloodscalp' },
    { value: 'connected-boulderfist', label: 'Boulderfist' },
    { value: 'connected-dunemaul', label: 'Dunemaul' },
    { value: 'connected-maiev', label: 'Maiev' },
    { value: 'connected-queldorei', label: "Quel'dorei" },
    { value: 'connected-senjin', label: "Sen'jin" },
    { value: 'connected-stonemaul', label: 'Stonemaul' },
    { value: 'connected-draktharon', label: "Drak'Tharon" },
    { value: 'connected-firetree', label: 'Firetree' },
    { value: 'connected-frostwolf', label: 'Frostwolf' },
    { value: 'connected-malorne', label: 'Malorne' },
    { value: 'connected-rivendare', label: 'Rivendare' },
    { value: 'connected-spirestone', label: 'Spirestone' },
    { value: 'connected-stormscale', label: 'Stormscale' },
    { value: 'connected-vashj', label: 'Vashj' },
    { value: 'connected-hyjal', label: 'Hyjal' },
    { value: 'connected-alleria', label: 'Alleria' },
    { value: 'connected-exodar', label: 'Exodar' },
    { value: 'connected-khadgar', label: 'Khadgar' },
    { value: 'connected-medivh', label: 'Medivh' },
    { value: 'connected-eredar', label: 'Eredar' },
    { value: 'connected-gorefiend', label: 'Gorefiend' },
    { value: 'connected-hellscream', label: 'Hellscream' },
    { value: 'connected-spinebreaker', label: 'Spinebreaker' },
    { value: 'connected-wildhammer', label: 'Wildhammer' },
    { value: 'connected-zangarmarsh', label: 'Zangarmarsh' },
    { value: 'connected-darrowmere', label: 'Darrowmere' },
    { value: 'connected-draka', label: 'Draka' },
    { value: 'connected-suramar', label: 'Suramar' },
    { value: 'connected-windrunner', label: 'Windrunner' },
    { value: 'connected-auchindoun', label: 'Auchindoun' },
    { value: 'connected-chogall', label: "Cho'gall" },
    { value: 'connected-elune', label: 'Elune' },
    { value: 'connected-gilneas', label: 'Gilneas' },
    { value: 'connected-laughing-skull', label: 'Laughing Skull' },
    { value: 'connected-azuremyst', label: 'Azuremyst' },
    { value: 'connected-dawnbringer', label: 'Dawnbringer' },
    { value: 'connected-madoran', label: 'Madoran' },
    { value: 'connected-staghelm', label: 'Staghelm' },
    { value: 'connected-anubarak', label: "Anub'arak" },
    { value: 'connected-arathor', label: 'Arathor' },
    { value: 'connected-chromaggus', label: 'Chromaggus' },
    { value: 'connected-crushridge', label: 'Crushridge' },
    { value: 'connected-drenden', label: 'Drenden' },
    { value: 'connected-garithos', label: 'Garithos' },
    { value: 'connected-nathrezim', label: 'Nathrezim' },
    { value: 'connected-smolderthorn', label: 'Smolderthorn' },
    { value: 'connected-blackwater-raiders', label: 'Blackwater Raiders' },
    { value: 'connected-cenarion-circle', label: 'Cenarion Circle' },
    { value: 'connected-shadow-council', label: 'Shadow Council' },
    { value: 'connected-sisters-of-elune', label: 'Sisters of Elune' },
    { value: 'connected-lightbringer', label: 'Lightbringer' },
    { value: 'connected-dentarg', label: 'Dentarg' },
    { value: 'connected-whisperwind', label: 'Whisperwind' },
    { value: 'connected-kiljaeden', label: "Kil'jaeden" },
    { value: 'connected-alterac-mountains', label: 'Alterac Mountains' },
    { value: 'connected-anvilmar', label: 'Anvilmar' },
    { value: 'connected-balnazzar', label: 'Balnazzar' },
    { value: 'connected-gorgonnash', label: 'Gorgonnash' },
    {
      value: 'connected-the-forgotten-coast',
      label: 'The Forgotten Coast'
    },
    { value: 'connected-undermine', label: 'Undermine' },
    { value: 'connected-warsong', label: 'Warsong' },
    { value: 'connected-aggramar', label: 'Aggramar' },
    { value: 'connected-fizzcrank', label: 'Fizzcrank' },
    { value: 'connected-drakkari', label: 'Drakkari' },
    { value: 'connected-aerie-peak', label: 'Aerie Peak' },
    { value: 'connected-nemesis', label: 'Nemesis' },
    { value: 'connected-tol-barad', label: 'Tol Barad' },
    { value: 'connected-farstriders', label: 'Farstriders' },
    { value: 'connected-silver-hand', label: 'Silver Hand' },
    {
      value: 'connected-thorium-brotherhood',
      label: 'Thorium Brotherhood'
    },
    { value: 'connected-durotan', label: 'Durotan' },
    { value: 'connected-ysera', label: 'Ysera' },
    { value: 'connected-lightninghoof', label: 'Lightninghoof' },
    { value: 'connected-maelstrom', label: 'Maelstrom' },
    { value: 'connected-ravenholdt', label: 'Ravenholdt' },
    { value: 'connected-the-venture-co', label: 'The Venture Co' },
    { value: 'connected-twisting-nether', label: 'Twisting Nether' },
    { value: 'connected-bloodhoof', label: 'Bloodhoof' },
    { value: 'connected-duskwood', label: 'Duskwood' },
    { value: 'connected-argent-dawn', label: 'Argent Dawn' },
    { value: 'connected-the-scryers', label: 'The Scryers' },
    { value: 'connected-alexstrasza', label: 'Alexstrasza' },
    { value: 'connected-terokkar', label: 'Terokkar' },
    { value: 'connected-baelgun', label: 'Baelgun' },
    { value: 'connected-doomhammer', label: 'Doomhammer' },
    { value: 'connected-nazgrel', label: 'Nazgrel' },
    { value: 'connected-nesingwary', label: 'Nesingwary' },
    { value: 'connected-veknilash', label: "Vek'nilash" },
    { value: 'connected-feathermoon', label: 'Feathermoon' },
    { value: 'connected-scarlet-crusade', label: 'Scarlet Crusade' },
    { value: 'connected-greymane', label: 'Greymane' },
    { value: 'connected-tanaris', label: 'Tanaris' },
    { value: 'connected-blackhand', label: 'Blackhand' },
    { value: 'connected-galakrond', label: 'Galakrond' },
    { value: 'connected-kirin-tor', label: 'Kirin Tor' },
    { value: 'connected-sentinels', label: 'Sentinels' },
    {
      value: 'connected-steamwheedle-cartel',
      label: 'Steamwheedle Cartel'
    },
    { value: 'connected-runetotem', label: 'Runetotem' },
    { value: 'connected-uther', label: 'Uther' },
    { value: 'connected-draenor', label: 'Draenor' },
    { value: 'connected-echo-isles', label: 'Echo Isles' },
    { value: 'connected-bladefist', label: 'Bladefist' },
    { value: 'connected-kul-tiras', label: 'Kul Tiras' },
    { value: 'connected-ravencrest', label: 'Ravencrest' },
    { value: 'connected-uldaman', label: 'Uldaman' },
    { value: 'connected-arthas', label: 'Arthas' },
    { value: 'connected-misha', label: 'Misha' },
    { value: 'connected-rexxar', label: 'Rexxar' },
    { value: 'connected-altar-of-storms', label: 'Altar of Storms' },
    { value: 'connected-anetheron', label: 'Anetheron' },
    { value: 'connected-magtheridon', label: 'Magtheridon' },
    { value: 'connected-ysondre', label: 'Ysondre' },
    { value: 'connected-eitrigg', label: 'Eitrigg' },
    { value: 'connected-shuhalo', label: "Shu'halo" },
    { value: 'connected-deathwing', label: 'Deathwing' },
    { value: 'connected-executus', label: 'Executus' },
    { value: 'connected-kalecgos', label: 'Kalecgos' },
    { value: 'connected-shattered-halls', label: 'Shattered Halls' },
    { value: 'connected-kilrogg', label: 'Kilrogg' },
    { value: 'connected-winterhoof', label: 'Winterhoof' },
    { value: 'connected-earthen-ring', label: 'Earthen Ring' },
    { value: 'connected-arygos', label: 'Arygos' },
    { value: 'connected-llane', label: 'Llane' },
    { value: 'connected-coilfang', label: 'Coilfang' },
    { value: 'connected-dalvengyr', label: 'Dalvengyr' },
    { value: 'connected-dark-iron', label: 'Dark Iron' },
    { value: 'connected-demon-soul', label: 'Demon Soul' },
    { value: 'connected-shattered-hand', label: 'Shattered Hand' },
    { value: 'connected-turalyon', label: 'Turalyon' },
    { value: 'connected-bronzebeard', label: 'Bronzebeard' },
    { value: 'connected-shandris', label: 'Shandris' },
    { value: 'connected-dragonblight', label: 'Dragonblight' },
    { value: 'connected-fenris', label: 'Fenris' },
    { value: 'connected-blackwing-lair', label: 'Blackwing Lair' },
    { value: 'connected-dethecus', label: 'Dethecus' },
    { value: 'connected-detheroc', label: 'Detheroc' },
    { value: 'connected-haomarush', label: 'Haomarush' },
    { value: 'connected-lethon', label: 'Lethon' },
    { value: 'connected-shadowmoon', label: 'Shadowmoon' },
    { value: 'connected-darkspear', label: 'Darkspear' },
    { value: 'connected-goldrinn', label: 'Goldrinn' },
    { value: 'connected-gallywix', label: 'Gallywix' },
    { value: 'connected-stormreaver', label: 'Stormreaver' }
  ]
};
