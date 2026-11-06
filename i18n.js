/* NextStep SG, translations (EN / 中文 / Bahasa Melayu).
 * English is the authoritative source (routes.json). The zh/ms "content"
 * blocks mirror routes.json and are machine-assisted, have a native speaker
 * review before publishing. Official links are the same in every language.
 */
window.NEXTSTEP_I18N = {

  en: {
    label: "EN",
    note: "",
    ui: {
      home_h1: "Let's take the next step, together.",
      home_lede: "Calm, private guidance for the first few minutes. We help; we never decide for you.",
      home_reassure: "<b>You're not in trouble. Don't delete anything yet.</b>",
      start: "Start, it takes 1 minute",
      see_routes: "See all routes", live_test: "Live test",
      mini: "Not an emergency service. If you are in danger, call <b>999</b>. Support: SOS <b>1767</b>.",
      voice_label: "Prefer to talk? Tap the mic.",
      step_of: "Step %1 of %2", back: "← Back", start_over: "← Start over",
      now_kicker: "Right now · step %1 of %2",
      done_next: "Done, next step ✓", done_last: "I've done this, what's next →",
      see_all: "Show me everything at once instead",
      protected: "✓ You've protected yourself",
      hardpart: "<b>That was the hard part.</b> Now: get a real person beside you.",
      label_tell: "Get a human on your side", sub_tell: "You shouldn't do this alone.",
      label_check: "Report it, when you're ready", sub_check: "No rush, do this when you're ready.",
      show_report: "Show the report steps",
      why: "Why this route?",
      why_intro: "Your answers matched a fixed rule. No AI decided this; nothing was sent anywhere:",
      why_what: "What", why_danger: "Danger now", why_under18: "Under 18", why_platform: "Platform", why_matched: "Matched rule",
      tell_btn: "Send to a trusted adult",
      support_bar: "<b>Overwhelmed?</b> Talk to someone any time, SOS <b>1767</b>, 24 hours.",
      nav_alerts: "Scam alerts", alerts_heading: "Latest scam alerts", alerts_btn: "If it happened to you →",
      home_scam_title: "I'm being scammed", home_scam_sub: "The first-10-minutes plan: bank, police, ScamShield",
      home_drill_title: "Scam quizzes", home_drill_sub: "2 quizzes, win the raffle",
      home_else: "Something else happened", nav_drill: "Scam Drill",
      tab_report: "Report", tab_news: "News", tab_play: "Play & win",
      listen: "Listen to your plan"
    }
  },

  zh: {
    label: "中文",
    note: "翻译为机器辅助，正式信息以英文版本为准。",
    ui: {
      home_h1: "网上发生了一些事。让我们一起走下一步。",
      home_lede: "在最初的几分钟里，给你冷静、清楚的指引。我们不评判，也不替你决定——我们帮你保护自己、用正确的方式举报，并告诉能帮你的人。",
      home_reassure: "<b>你没有做错事。先别删除任何东西。</b> 点四下，你就会有清楚的计划。",
      start: "开始, 只需 1 分钟",
      see_routes: "查看所有路线", live_test: "现场测试",
      mini: "这不是紧急服务。如果有危险，请拨打 <b>999</b>。情绪支持：SOS <b>1767</b>。",
      voice_label: "想用说的？点麦克风。",
      step_of: "第 %1 步，共 %2 步", back: "← 返回", start_over: "← 重新开始",
      now_kicker: "现在 · 第 %1 步，共 %2 步",
      done_next: "完成, 下一步 ✓", done_last: "我做好了, 接下来 →",
      see_all: "我想一次看到全部",
      protected: "✓ 你已经保护好自己了",
      hardpart: "<b>最难的部分过去了，做得很好。</b> 接下来最重要的一步：让一个真实的人在你身边。",
      label_tell: "找一个人站在你这边", sub_tell: "最重要的一步。你不该一个人面对。",
      label_check: "举报, 等你准备好", sub_check: "不用急，今天晚点做也行。使用前请先确认每个链接。",
      show_report: "显示举报步骤",
      why: "为什么是这条路线？",
      why_intro: "系统把你的答案对照规则表——不是 AI 决定的，也没有把任何资料发送出去：",
      why_what: "类型", why_danger: "是否有危险", why_under18: "未满 18 岁", why_platform: "平台", why_matched: "匹配的规则",
      tell_btn: "发送给可信任的大人",
      support_bar: "<b>现在感到不知所措吗？</b> 你随时可以找人聊聊——新加坡援人协会 (SOS)：拨打 <b>1767</b> 或发短信 <b>9151 1767</b>，24 小时。",
      nav_alerts: "诈骗警报", alerts_heading: "最新诈骗警报", alerts_btn: "如果你遇到了 →",
      home_scam_title: "我被骗了", home_scam_sub: "最初 10 分钟的步骤：银行、报警、ScamShield",
      home_drill_title: "诈骗测验", home_drill_sub: "2 个测验，赢取抽奖",
      home_else: "发生了别的事", nav_drill: "诈骗演练",
      tab_report: "举报", tab_news: "新闻", tab_play: "玩游戏赢奖",
      listen: "收听你的计划"
    },
    content: {
      questions: [
        { id: "harm", title: "发生了什么事？", options: [
          { value: "intimate_images", label: "有人分享、或威胁要分享我的私密照片" },
          { value: "doxxing", label: "我的个人资料被公开了（人肉搜索）" },
          { value: "harassment", label: "我被骚扰或欺凌" },
          { value: "impersonation", label: "有人假冒我" },
          { value: "scam", label: "我被骗了，或有人想骗我" } ] },
        { id: "danger_now", title: "这是正在发生，或你有危险吗？", options: [
          { value: "yes", label: "是的，正在发生／我感到不安全" },
          { value: "no", label: "不是，现在没有" } ] },
        { id: "under18", title: "你未满 18 岁吗？", options: [
          { value: "yes", label: "是" }, { value: "no", label: "否" } ] },
        { id: "platform", title: "这件事发生在哪里？", options: [
          { value: "instagram", label: "Instagram" }, { value: "tiktok", label: "TikTok" },
          { value: "telegram", label: "Telegram" }, { value: "whatsapp", label: "WhatsApp" },
          { value: "discord", label: "Discord" }, { value: "other", label: "其他" } ] }
      ],
      platforms: {
        instagram: { label: "Instagram", report: "打开贴文、个人资料或讯息，点 ••• 选单，选择「举报」，再选原因（裸露、骚扰或假冒他人）。" },
        tiktok: { label: "TikTok", report: "长按影片或讯息，或点「分享」再点「举报」，按步骤进行。" },
        telegram: { label: "Telegram", report: "打开聊天或频道，点上方名称，选择「举报」，再选原因。" },
        whatsapp: { label: "WhatsApp", report: "打开聊天，点联络人名称，往下滑点「举报」（会同时举报并封锁）。" },
        discord: { label: "Discord", report: "长按讯息，选择「举报」，尽量保留讯息链接。" },
        other: { label: "这个平台", report: "找到应用或网站的「举报」或「安全」选项（通常在 ••• 选单或设定里）并举报内容。" }
      },
      support: { label: "你值得被支持。这些都是免费且保密的：", lines: [
        "新加坡援人协会 (SOS)：拨打 1767 或发短信 9151 1767，24 小时",
        "mindline.sg, 免费心理健康支持：https://mindline.sg" ] },
      harms: {
        intimate_images: { label: "私密照片被分享或被威胁", headline: "先保护你。你没有做错事。", add: [
          "先别删除任何东西。那些讯息和贴文是你的证据。", "把讯息或贴文截图，要能看到用户名、日期和链接 (URL)。",
          "不要把照片本身转发给任何人，即使是为了证明。", "如果有人勒索钱，不要回复，也不要付钱。", "只有在截图之后，才封锁对方。" ],
          check: [ "在事发平台举报（步骤见下）。",
          "直接向网络安全委员会 (OSC) 举报要求下架——私密影像滥用可以马上举报，免费：https://www.osc.gov.sg",
          "需要专门帮助（辅导、免费法律咨询、快速下架）可联系 SHECARES@SCWO：拨打 8001 01 4616 或 WhatsApp 8985 5528（周一至周五 9am–9pm）——https://she.org.sg" ],
          tell: [ "今天就找一个你信任的人聊聊。你不该独自承受。" ] },
        doxxing: { label: "个人资料被公开（人肉搜索）", headline: "我们来保护你的资料并让它下架。", add: [
          "先别删除任何东西。保留贴文作为证据。", "把贴文截图，要能看到用户名、日期和链接 (URL)。",
          "记下你的资料出现在哪里（哪个应用、哪个账号）。", "尽量把账号设为私密，并开启双重验证登录。", "截图之后再封锁对方。" ],
          check: [ "在平台举报贴文（步骤见下）并要求移除。",
          "直接向网络安全委员会 (OSC) 举报——人肉搜索可以马上举报，免费：https://www.osc.gov.sg",
          "公开他人私人资料以骚扰，可能触犯《防止骚扰法令》。" ],
          tell: [ "告诉一个你信任的人，别一个人处理。" ] },
        harassment: { label: "骚扰或欺凌", headline: "这不是你的错。我们慢慢来，找人帮忙。", add: [
          "不要删除讯息，它们显示了正在发生的事。", "把讯息或留言截图，带上用户名、日期和链接 (URL)。",
          "如果应用允许，先静音或限制留言，减轻现在的压力。", "截图之后再封锁对方。" ],
          check: [ "先在平台举报账号或讯息（步骤见下）。",
          "如果没有停止，可在向平台举报的 24 小时后，升级到网络安全委员会 (OSC)，免费：https://www.osc.gov.sg",
          "持续的骚扰可能受《防止骚扰法令》保护。" ],
          tell: [ "告诉一个你信任的人。被相信很重要。" ] },
        impersonation: { label: "有人假冒你", headline: "我们来证明是你，并关掉假账号。", add: [
          "不要删除任何东西。保留假账号的链接。", "把假的个人资料截图，带上用户名、日期和链接 (URL)。",
          "暂时叫好友不要和假账号互动。", "保护你真正的账号：改密码并开启双重验证登录。" ],
          check: [ "用平台的「假冒举报」说明这个账号在假冒你（步骤见下）。你可能需要提供身份证明。",
          "如果假账号还在，向网络安全委员会 (OSC) 举报，免费：https://www.osc.gov.sg" ],
          tell: [ "让一个你信任的人知道，帮你留意那个假账号。" ] },
        scam: { label: "诈骗", headline: "我们来止住损失并举报。很多人都遇过这种事。", add: [
          "不要再转账，也别再回复对方。",
          "如果已转账或泄露了卡资料，立刻联系银行冻结交易和银行卡。",
          "把聊天、账号／号码和任何转账细节截图。",
          "如果你透露了密码或一次性验证码 (OTP)，现在就改掉。",
          "别删除对话——那是证据。" ],
          check: [ "在平台上举报诈骗账号（步骤见下）。",
          "报警——即使你也在别处举报，这一步也很重要：https://www.police.gov.sg/e-services/lodge-police-report",
          "拨打 24 小时 ScamShield 热线 1799 查证并举报诈骗：https://www.scamshield.gov.sg",
          "绝不要付钱给任何声称能「帮你追回损失」的人。警方不提供收费追款服务，这些也是诈骗。" ],
          tell: [ "告诉一个你信任的人——骗子就靠你太尴尬而不敢说出口。" ] }
      },
      modifiers: {
        danger_now_yes: { banner: "emergency",
          banner_text: "如果你有立即的危险，或有人在威胁你（例如「付钱，不然我公开你的照片」），现在就拨打警察 999。",
          add_first: "如果你有立即危险，先拨打警察 999。",
          check_add: "因为事情正在发生：紧急情况拨打警察 999，或在线做非紧急报案：https://www.police.gov.sg/e-services/lodge-police-report" },
        danger_now_no: { banner: "calm", banner_text: "你还有时间。我们一步一步来。",
          check_add: "如果你感到不安全，可以拨打 999，或在线做非紧急报案：https://www.police.gov.sg/e-services/lodge-police-report" },
        under18_yes: { tell_first: "你未满 18 岁，所以现在告诉一个可信任的大人是最重要的一步：父母、亲戚、老师、学校辅导员或教练。", show_trusted_adult_button: true },
        under18_no: { tell_first: "告诉一个你信任的人：朋友、家人或辅导员。你不必独自面对。", show_trusted_adult_button: true }
      },
      trusted_adult_message: "嗨，我在网上遇到了一些事，需要帮忙。你有空时我们可以聊聊吗？我没有删除任何东西，正在按步骤举报。"
    }
  },

  ms: {
    label: "Melayu",
    note: "Terjemahan dibantu mesin; sila rujuk versi Bahasa Inggeris untuk maklumat rasmi.",
    ui: {
      home_h1: "Sesuatu berlaku dalam talian. Mari ambil langkah seterusnya bersama.",
      home_lede: "Panduan ringkas dan tenang untuk beberapa minit pertama. Kami tidak menghakimi dan tidak membuat keputusan untuk awak, kami bantu awak lindungi diri, laporkan dengan cara betul, dan beritahu seseorang yang boleh bantu.",
      home_reassure: "<b>Awak tidak dalam masalah. Jangan padam apa-apa dahulu.</b> Empat ketikan dan awak akan ada pelan yang jelas.",
      start: "Mula, ambil masa 1 minit",
      see_routes: "Lihat semua laluan", live_test: "Ujian langsung",
      mini: "Ini bukan perkhidmatan kecemasan. Jika dalam bahaya, hubungi <b>999</b>. Sokongan: SOS <b>1767</b>.",
      voice_label: "Lebih selesa bercakap? Ketik mikrofon.",
      step_of: "Langkah %1 drpd %2", back: "← Kembali", start_over: "← Mula semula",
      now_kicker: "Sekarang · langkah %1 drpd %2",
      done_next: "Selesai, langkah seterusnya ✓", done_last: "Saya dah buat, apa seterusnya →",
      see_all: "Tunjukkan semua sekali gus",
      protected: "✓ Awak dah lindungi diri",
      hardpart: "<b>Itu bahagian paling susah, syabas.</b> Kini langkah utama: dapatkan orang sebenar di sisi awak.",
      label_tell: "Dapatkan seseorang di pihak awak", sub_tell: "Langkah paling penting. Awak tidak patut hadapinya seorang diri.",
      label_check: "Laporkan, bila awak dah bersedia", sub_check: "Tak perlu tergesa. Boleh buat kemudian hari ini. Sahkan setiap pautan sebelum guna.",
      show_report: "Tunjukkan langkah laporan",
      why: "Kenapa laluan ini?",
      why_intro: "Enjin memadankan jawapan awak dengan jadual peraturan, bukan AI yang putuskan, dan tiada apa-apa dihantar ke mana-mana:",
      why_what: "Jenis", why_danger: "Bahaya sekarang", why_under18: "Bawah 18", why_platform: "Platform", why_matched: "Peraturan dipadankan",
      tell_btn: "Hantar kepada orang dewasa dipercayai",
      support_bar: "<b>Rasa terbeban sekarang?</b> Awak boleh berbual dengan seseorang bila-bila masa, Samaritans of Singapore (SOS): hubungi <b>1767</b> atau teks <b>9151 1767</b>, 24 jam.",
      nav_alerts: "Amaran penipuan", alerts_heading: "Amaran penipuan terkini", alerts_btn: "Jika ia berlaku pada awak →",
      home_scam_title: "Saya ditipu", home_scam_sub: "Pelan 10 minit pertama: bank, polis, ScamShield",
      home_drill_title: "Kuiz penipuan", home_drill_sub: "2 kuiz, menang cabutan",
      home_else: "Sesuatu yang lain berlaku", nav_drill: "Latihan penipuan",
      tab_report: "Lapor", tab_news: "Berita", tab_play: "Main & menang",
      listen: "Dengar pelan awak"
    },
    content: {
      questions: [
        { id: "harm", title: "Apa yang berlaku?", options: [
          { value: "intimate_images", label: "Seseorang kongsi atau ugut nak kongsi gambar intim saya" },
          { value: "doxxing", label: "Maklumat peribadi saya disiarkan (doxxing)" },
          { value: "harassment", label: "Saya diganggu atau dibuli" },
          { value: "impersonation", label: "Seseorang menyamar sebagai saya" },
          { value: "scam", label: "Saya ditipu atau ada yang cuba menipu saya" } ] },
        { id: "danger_now", title: "Adakah ini berlaku sekarang, atau awak dalam bahaya?", options: [
          { value: "yes", label: "Ya, sekarang / saya rasa tak selamat" },
          { value: "no", label: "Tidak, bukan sekarang" } ] },
        { id: "under18", title: "Adakah awak bawah 18 tahun?", options: [
          { value: "yes", label: "Ya" }, { value: "no", label: "Tidak" } ] },
        { id: "platform", title: "Di mana ia berlaku?", options: [
          { value: "instagram", label: "Instagram" }, { value: "tiktok", label: "TikTok" },
          { value: "telegram", label: "Telegram" }, { value: "whatsapp", label: "WhatsApp" },
          { value: "discord", label: "Discord" }, { value: "other", label: "Lain-lain" } ] }
      ],
      platforms: {
        instagram: { label: "Instagram", report: "Buka siaran, profil atau mesej, ketik menu •••, pilih Report, dan pilih sebab (kebogelan, gangguan, atau menyamar)." },
        tiktok: { label: "TikTok", report: "Tekan dan tahan video atau mesej, atau ketik Share kemudian Report, dan ikut langkah." },
        telegram: { label: "Telegram", report: "Buka sembang atau saluran, ketik nama di atas, pilih Report, dan pilih sebab." },
        whatsapp: { label: "WhatsApp", report: "Buka sembang, ketik nama kenalan, tatal ke bawah dan ketik Report (ini melapor dan menyekat sekali gus)." },
        discord: { label: "Discord", report: "Tekan dan tahan mesej, pilih Report, dan simpan pautan mesej jika boleh." },
        other: { label: "platform ini", report: "Cari pilihan Report atau Safety aplikasi/laman (biasanya di menu ••• atau Tetapan) dan laporkan kandungan itu." }
      },
      support: { label: "Awak layak dapat sokongan. Ini percuma dan sulit:", lines: [
        "Samaritans of Singapore (SOS): hubungi 1767 atau teks 9151 1767, 24 jam",
        "mindline.sg, sokongan kesihatan mental percuma: https://mindline.sg" ] },
      harms: {
        intimate_images: { label: "Gambar intim dikongsi atau diugut", headline: "Mari lindungi awak dahulu. Awak tidak dalam masalah.", add: [
          "Jangan padam apa-apa dahulu. Mesej dan siaran itu bukti awak.", "Tangkap skrin mesej/siaran supaya nampak nama pengguna, tarikh dan pautan (URL).",
          "Jangan hantar gambar itu kepada sesiapa, walaupun untuk bukti.", "Jangan balas ugutan atau bayar jika ada yang memeras wang.", "Sekat orang itu HANYA SELEPAS awak tangkap skrin." ],
          check: [ "Laporkan di platform tempat ia berlaku (langkah di bawah).",
          "Laporkan terus kepada Online Safety Commission (OSC) untuk ditarik turun, penderaan imej intim boleh dilaporkan terus, percuma: https://www.osc.gov.sg",
          "Untuk bantuan khusus (kaunseling, klinik undang-undang percuma, tarik turun cepat), hubungi SHECARES@SCWO: 8001 01 4616 atau WhatsApp 8985 5528 (Isnin–Jumaat 9pg–9mlm), https://she.org.sg" ],
          tell: [ "Berbual dengan seseorang yang awak percaya hari ini. Jangan tanggung sendirian." ] },
        doxxing: { label: "Maklumat peribadi disiarkan (doxxing)", headline: "Mari amankan maklumat awak dan tarik turun.", add: [
          "Jangan padam apa-apa dahulu. Simpan siaran sebagai bukti.", "Tangkap skrin siaran dengan nama pengguna, tarikh dan pautan (URL).",
          "Catat di mana maklumat awak muncul (aplikasi mana, akaun mana).", "Jadikan akaun awak peribadi dan hidupkan log masuk dua faktor jika boleh.", "Sekat orang itu SELEPAS tangkap skrin." ],
          check: [ "Laporkan siaran di platform (langkah di bawah) dan minta ia dibuang.",
          "Laporkan terus kepada Online Safety Commission (OSC), doxxing boleh dilaporkan terus, percuma: https://www.osc.gov.sg",
          "Menyiarkan maklumat peribadi orang untuk mengganggu mungkin satu kesalahan di bawah Akta Perlindungan daripada Gangguan." ],
          tell: [ "Beritahu seseorang yang awak percaya supaya tidak menghadapinya sendirian." ] },
        harassment: { label: "Gangguan atau buli", headline: "Ini bukan salah awak. Mari perlahankan dan cari bantuan.", add: [
          "Jangan padam mesej. Ia menunjukkan apa yang berlaku.", "Tangkap skrin mesej/komen dengan nama pengguna, tarikh dan pautan (URL).",
          "Bisukan atau hadkan komen jika aplikasi benarkan, untuk kurangkan tekanan sekarang.", "Sekat orang itu SELEPAS tangkap skrin." ],
          check: [ "Laporkan akaun atau mesej di platform dahulu (langkah di bawah).",
          "Jika tidak berhenti, awak boleh naikkan kepada Online Safety Commission (OSC) 24 jam selepas melaporkannya kepada platform, percuma: https://www.osc.gov.sg",
          "Gangguan berterusan mungkin dilindungi Akta Perlindungan daripada Gangguan." ],
          tell: [ "Beritahu seseorang yang awak percaya. Dipercayai itu sangat bermakna." ] },
        impersonation: { label: "Seseorang menyamar sebagai awak", headline: "Mari buktikan ia awak dan tutup akaun palsu itu.", add: [
          "Jangan padam apa-apa. Simpan pautan ke akaun palsu.", "Tangkap skrin profil palsu dengan nama pengguna, tarikh dan pautan (URL).",
          "Minta kawan rapat jangan berinteraksi dengan akaun palsu buat sementara.", "Amankan akaun sebenar awak: tukar kata laluan dan hidupkan log masuk dua faktor." ],
          check: [ "Guna laporan menyamar platform untuk kata akaun ini menyamar sebagai awak (langkah di bawah). Awak mungkin diminta bukti identiti.",
          "Jika akaun palsu masih ada, laporkan kepada Online Safety Commission (OSC), percuma: https://www.osc.gov.sg" ],
          tell: [ "Beritahu seseorang yang awak percaya supaya mereka boleh bantu perhati akaun palsu itu." ] },
        scam: { label: "Penipuan", headline: "Mari hentikan wang dan laporkannya. Ramai orang mengalaminya.", add: [
          "Jangan hantar wang lagi, dan berhenti membalas orang itu.",
          "Hubungi bank awak segera untuk sekat transaksi dan bekukan kad jika wang dihantar atau butiran kad dikongsi.",
          "Tangkap skrin sembang, akaun atau nombor, dan butiran pindahan.",
          "Jika awak kongsi kata laluan atau OTP, tukar sekarang.",
          "Jangan padam perbualan, ia bukti." ],
          check: [ "Laporkan akaun penipu di platform (langkah di bawah).",
          "Buat laporan Polis, ini penting walaupun awak lapor di tempat lain: https://www.police.gov.sg/e-services/lodge-police-report",
          "Hubungi Talian ScamShield 24 jam di 1799 untuk semak dan laporkan penipuan: https://www.scamshield.gov.sg",
          "Jangan sekali-kali bayar sesiapa yang janji 'memulihkan' wang awak. Polis tidak menawarkan perkhidmatan pemulihan berbayar, itu juga penipuan." ],
          tell: [ "Beritahu seseorang yang awak percaya, penipuan bergantung pada awak rasa malu untuk bersuara." ] }
      },
      modifiers: {
        danger_now_yes: { banner: "emergency",
          banner_text: "Jika awak dalam bahaya segera, atau ada yang mengugut awak (cth. 'bayar atau saya siar gambar awak'), hubungi Polis 999 sekarang.",
          add_first: "Jika awak dalam bahaya segera, hubungi Polis 999 dahulu.",
          check_add: "Kerana ini berlaku sekarang: hubungi Polis 999 untuk kecemasan, atau buat laporan bukan kecemasan dalam talian: https://www.police.gov.sg/e-services/lodge-police-report" },
        danger_now_no: { banner: "calm", banner_text: "Awak ada masa. Mari buat langkah demi langkah.",
          check_add: "Jika awak rasa tak selamat, awak boleh hubungi 999, atau buat laporan Polis bukan kecemasan dalam talian: https://www.police.gov.sg/e-services/lodge-police-report" },
        under18_yes: { tell_first: "Awak bawah 18, jadi memberitahu orang dewasa dipercayai sekarang ialah langkah paling penting: ibu bapa, saudara, guru, kaunselor sekolah, atau jurulatih.", show_trusted_adult_button: true },
        under18_no: { tell_first: "Beritahu seseorang yang awak percaya: kawan, ahli keluarga, atau kaunselor. Awak tak perlu hadapinya sendirian.", show_trusted_adult_button: true }
      },
      trusted_adult_message: "Hai, sesuatu berlaku pada saya dalam talian dan saya perlukan bantuan. Boleh kita berbual bila awak lapang? Saya tak padam apa-apa dan saya sedang ikut langkah untuk melaporkannya."
    }
  }
};
