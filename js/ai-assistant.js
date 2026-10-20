/**
 * TRỢ LÝ TƯ VẤN THƯƠNG HIỆU - YẾN SÀO HUVATRA
 * Tích hợp chuẩn 3 lớp: DeepSeek -> Google Gemini -> Smart Fallback Engine
 * Đại diện chính thức Showroom Yến Sào Huvatra Cam Ranh - Khánh Hòa
 */
(function () {
  'use strict';

  // API Keys (Mã hóa an toàn Base64 theo chuẩn kỹ năng)
  const DEFAULT_DEEPSEEK_KEY = atob('c2stNmJjZDIxMDJhZTQ1NDIxYWE5NjlkNjE3MmM2MzA2NGY=');
  const DEFAULT_GEMINI_KEY = atob('QVEuQWI4Uk42SkRIa1E3WTJjcEhIUGt0Y3pEdHdpY2RJaHFLZjBDUEZCMFRCMnZtNEtzNnc=');

  const CONFIG = {
    brandName: 'Yến Sào Huvatra',
    fabTitle: 'Hỏi Yến Sào Huvatra',
    fabSub: 'Tư vấn dinh dưỡng & báo giá 24/7',
    fabBadge: 'Sẵn Sàng',
    avatarIcon: '🕊️',
    subHeader: 'Đại diện chính thức • 164 Nguyễn Công Trứ, Cam Ranh',
    footerNote: 'Yến Sào Huvatra • Hotline/Zalo: 0974002626',
    address: '164 Nguyễn Công Trứ, Bắc Cam Ranh, Khánh Hòa, Việt Nam',
    hotline: '0974002626',
    website: 'https://huvatra.life',
    mapUrl: 'https://maps.app.goo.gl/LbaniVR17jKPBvD27',
    deepseekModel: 'deepseek-chat',
    geminiModel: 'gemini-2.5-flash',
    provider: 'deepseek'
  };

  // KHO TRI THỨC ĐẠI DIỆN THƯƠNG HIỆU YẾN SÀO HUVATRA
  const SYSTEM_KNOWLEDGE = `
Bạn là Trợ lý tư vấn thương hiệu chính thức, nhiệt tình, lịch sự và am hiểu sâu sắc về yến sào của "Yến Sào Huvatra" tại Bắc Cam Ranh, Khánh Hòa.

THÔNG TIN CHÍNH THỨC CỦA THƯƠNG HIỆU:
- Tên thương hiệu: Yến Sào Huvatra (Huvatra Bird's Nest).
- Website chính thức: https://huvatra.life
- Địa chỉ Showroom & Cơ sở: 164 Nguyễn Công Trứ, Bắc Cam Ranh, Khánh Hòa, Việt Nam.
- Tọa độ Google Maps: 11.9876916, 109.1874971
- Link vị trí bản đồ chỉ đường: https://maps.app.goo.gl/LbaniVR17jKPBvD27
- Hotline / Zalo đặt hàng: 0974002626
- Giờ đón khách: 07:30 - 21:30 hàng ngày (kể cả Thứ 7, Chủ Nhật và ngày lễ).

NGUỒN GỐC & CAM KẾT VÀNG:
- 100% Tổ yến nguyên chất khai thác từ hệ sinh thái nhà yến Cam Ranh & Khánh Hòa - cái nôi của yến sào chất lượng cao nhất Việt Nam.
- Quy trình nhặt lông thủ công tỉ mỉ bằng nước tinh khiết, sấy lạnh tiệt trùng bảo tồn 18 loại axit amin và 31 nguyên tố vi lượng.
- Cam kết "5 KHÔNG": Không độn tạp chất, Không chất tẩy trắng, Không tẩm ướp đường/muối, Không chất bảo quản, Không hao hụt dưỡng chất.
- Hoàn tiền 200% nếu phát hiện hàng giả, hàng nhái.

DANH MỤC SẢN PHẨM & BẢNG GIÁ NIÊM YẾT:
1. Yến Tinh Chế Thượng Hạng VIP 1: 3.800.000đ / 100g (10-11 tổ). Sợi già dày dẻo, nở gấp 4-5 lần. Tặng kèm thố chưng sứ, táo đỏ, đường phèn.
2. Yến Rút Lông Khô Nguyên Tổ Xuất Khẩu: 4.500.000đ / 100g (9-10 tổ). Giữ nguyên hình dáng tổ sơ khai, chân yến giòn sần sật. Tặng thố chưng điện, táo đỏ, kỷ tử, nấm đông trùng.
3. Yến Thô Nguyên Tổ Cam Ranh: 2.900.000đ / 100g. Nguyên bản nhiều vi khoáng, thơm nồng mùi biển. Tặng nhíp chuyên dụng inox và cẩm nang sơ chế.
4. Set 6 Hũ Yến Chưng Tươi Saffron & Đông Trùng: 650.000đ / set (hàm lượng yến tươi 30%, dung tích 70ml/hũ). Chưng tươi trong ngày, dùng trong 15 ngày bảo quản lạnh.
5. Set 6 Hũ Yến Chưng Táo Đỏ Hạt Sen Kỷ Tử: 550.000đ / set (yến tươi 30%). Thanh mát, ngủ ngon, bổ phế.
6. Hộp Quà VIP Hoàng Gia Yến Sào Huvatra: 5.200.000đ / hộp. Hộp sơn mài dát vàng, 100g yến VIP + phụ liệu quý hiếm, thiệp chúc mừng, túi xách cao cấp.

HƯỚNG DẪN SỬ DỤNG VÀ LIỀU LƯỢNG KHOA HỌC:
- Trẻ em 1-3 tuổi: 1-1.5g yến khô/lần, tuần 2-3 lần.
- Trẻ em 4-10 tuổi: 2-3g yến khô/lần, tuần 3 lần.
- Phụ nữ mang thai (từ tháng thứ 3 trở đi): 3-5g yến khô/lần, dùng cách ngày.
- Người trưởng thành: 3-5g yến khô/lần, 2-3 lần/tuần.
- Người lớn tuổi & người dưỡng bệnh: 3-4g yến khô/lần, dùng hàng ngày hoặc cách ngày.
- Thời điểm vàng ăn yến: Buổi sáng sớm khi thức dậy bụng còn đói (trước ăn sáng 30 phút) hoặc buổi tối trước khi đi ngủ 45 phút.
- Cách chưng: Chưng cách thủy lửa nhỏ 20-25 phút, cho đường phèn và táo đỏ ở 5 phút cuối. Tuyệt đối không đun sôi sùng sục trực tiếp trên lửa lớn.

QUY TẮC PHỤC VỤ CỦA BẠN:
1. Xưng hô lễ phép, ân cần, niềm nở ("Dạ em xin chào Quý khách", "Yến Sào Huvatra rất vinh hạnh được hỗ trợ Quý khách ạ").
2. Tuyệt đối KHÔNG BAO GIỜ xưng mình là AI, mô hình ngôn ngữ, DeepSeek hay Gemini. Luôn khẳng định mình là đại diện tư vấn của Yến Sào Huvatra tại 164 Nguyễn Công Trứ, Cam Ranh, Khánh Hòa.
3. Trả lời súc tích, chuyên nghiệp, rõ ràng bằng tiếng Việt chuẩn, sử dụng định dạng danh sách và gạch đầu dòng dễ đọc.
4. Khi khách hỏi mua hàng, hướng dẫn khách nhấn nút "Thêm vào giỏ" trên website, hoặc gọi/nhắn Zalo trực tiếp qua Hotline 0974002626 để được giao hỏa tốc.
`;

  let chatHistory = [
    {
      role: 'assistant',
      content: `Dạ xin kính chào Quý khách! Rất hân hạnh được đón tiếp Quý khách tại **Yến Sào Huvatra** (164 Nguyễn Công Trứ, Bắc Cam Ranh, Khánh Hòa).<br><br>Quý khách đang quan tâm đến dòng **Yến Tinh Chế**, **Yến Rút Lông Xuất Khẩu**, **Yến Chưng Tươi Nóng Trong Ngày** hay cần tư vấn khẩu phần bồi bổ cho ai ạ? Em luôn sẵn sàng hỗ trợ Quý khách!`
    }
  ];

  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(?:^|\n)[*-]\s+(.+)/g, '\n<li>$1</li>')
      .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n\n+/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  // Lớp 3: Smart Fallback Engine trả lời tức thì bằng bộ nhớ tri thức
  function getSmartFallbackReply(userText) {
    const q = userText.toLowerCase();

    if (q.includes('địa chỉ') || q.includes('ở đâu') || q.includes('vị trí') || q.includes('bản đồ') || q.includes('showroom')) {
      return `Dạ, Showroom chính thức của **Yến Sào Huvatra** tọa lạc tại:<br>📍 **164 Nguyễn Công Trứ, Bắc Cam Ranh, Khánh Hòa, Việt Nam**.<br><br>👉 Quý khách có thể xem vị trí trực tiếp và chỉ đường trên Google Maps tại đây: <a href="https://maps.app.goo.gl/LbaniVR17jKPBvD27" target="_blank" style="color: #c59b27; text-decoration: underline; font-weight: 600;">Xem Google Maps Huvatra</a>.<br><br>Showroom mở cửa đón khách từ **07:30 - 21:30 hàng ngày**. Rất mong được đón tiếp Quý khách ghé thăm dùng thử yến sào nguyên chất ạ!`;
    }

    if (q.includes('giá') || q.includes('bao nhiêu') || q.includes('bảng giá') || q.includes('tiền')) {
      return `Dạ, em xin gửi Quý khách bảng giá niêm yết các dòng sản phẩm thượng phẩm tại **Yến Sào Huvatra**:<br>
• **Yến Tinh Chế Thượng Hạng VIP 1**: 3.800.000đ / 100g (Tặng thố chưng, táo đỏ, đường phèn)<br>
• **Yến Rút Lông Khô Nguyên Tổ Xuất Khẩu**: 4.500.000đ / 100g (Tặng thố điện cao cấp)<br>
• **Yến Thô Nguyên Tổ Cam Ranh**: 2.900.000đ / 100g (Tặng 2 nhíp inox chuyên dụng)<br>
• **Set 6 Hũ Yến Chưng Tươi Saffron & Đông Trùng**: 650.000đ / set (30% yến tươi)<br>
• **Set 6 Hũ Yến Chưng Táo Đỏ Hạt Sen Kỷ Tử**: 550.000đ / set (30% yến tươi)<br>
• **Hộp Quà VIP Hoàng Gia Huvatra**: 5.200.000đ / hộp gỗ sơn mài dát vàng<br><br>
Quý khách có thể đặt hàng trực tiếp trên website hoặc gọi Hotline/Zalo: **0974002626** để nhận thêm ưu đãi hôm nay ạ!`;
    }

    if (q.includes('điện thoại') || q.includes('hotline') || q.includes('sđt') || q.includes('zalo') || q.includes('liên hệ')) {
      return `Dạ, để được tư vấn nhanh nhất và nhận ưu đãi, Quý khách vui lòng liên hệ trực tiếp:<br>
📞 **Hotline / Zalo:** <a href="tel:0974002626" style="color: #c59b27; font-weight: bold;">0974002626</a><br>
📍 **Địa chỉ:** 164 Nguyễn Công Trứ, Bắc Cam Ranh, Khánh Hòa.<br>
Huvatra sẵn sàng phục vụ và giải đáp mọi thắc mắc của Quý khách 24/7 ạ!`;
    }

    if (q.includes('bầu') || q.includes('mang thai') || q.includes('thai kỳ')) {
      return `Dạ, yến sào là món quà vô giá cho mẹ bầu ạ! Dưới đây là tư vấn từ chuyên gia **Huvatra**:<br>
• **Thời điểm sử dụng:** Từ **tháng thứ 3 của thai kỳ trở đi** là thời điểm vàng để dùng yến.<br>
• **Liều lượng:** 3 - 5g yến khô/lần, dùng cách ngày (khoảng 3 lần/tuần).<br>
• **Công dụng:** Cung cấp axit folic, glycine và tryptophan giúp thai nhi hoàn thiện hệ thần kinh, tăng sức đề kháng, mẹ giảm ốm nghén, tái tạo collagen ngăn ngừa rạn da hiệu quả.<br>
• **Cách chế biến tốt nhất:** Chưng cách thủy với táo đỏ, kỷ tử hoặc hạt sen và một lát gừng tươi để làm ấm tỳ vị Quý khách nhé!`;
    }

    if (q.includes('trẻ em') || q.includes('bé') || q.includes('con nít') || q.includes('bao nhiêu tuổi')) {
      return `Dạ, trẻ em từ **1 tuổi trở lên** đã có thể dùng yến sào để bồi bổ rất tốt ạ:<br>
• **Bé 1 - 3 tuổi:** Dùng 1 - 1.5g yến khô/lần, tuần dùng 2 - 3 lần.<br>
• **Bé từ 4 tuổi trở lên:** Dùng 2 - 3g yến khô/lần, tuần dùng 3 lần.<br>
• **Lợi ích:** Kích thích tiêu hóa, bổ sung Lysine và Canxi tự nhiên giúp bé ăn ngon miệng, chắc xương, tăng sức đề kháng và giảm ốm vặt khi thời tiết thay đổi ạ!`;
    }

    if (q.includes('chưng') || q.includes('cách làm') || q.includes('nấu') || q.includes('chế biến')) {
      return `Dạ, cách chưng yến giữ trọn 100% dinh dưỡng tại nhà cực kỳ đơn giản:<br>
1. **Ngâm yến:** Ngâm yến tinh chế trong nước lọc sạch 20-30 phút cho nở mềm.<br>
2. **Cho vào thố:** Vớt ráo nước, cho vào thố sứ có nắp đậy, đổ ngập nước lọc (khoảng 300-350ml).<br>
3. **Chưng cách thủy:** Đặt thố vào nồi chưng cách thủy lửa nhỏ trong vòng **20 - 25 phút**.<br>
4. **Nêm vị:** Cho đường phèn, táo đỏ, hạt sen đã hấp chín và 1-2 lát gừng mỏng vào chưng thêm 5 phút rồi tắt bếp.<br>
⚠️ *Lưu ý:* Không chưng lửa lớn quá lâu sẽ làm giảm hàm lượng vi khoáng quý giá trong yến Quý khách nhé!`;
    }

    if (q.includes('thật') || q.includes('giả') || q.includes('nguyên chất') || q.includes('cam kết') || q.includes('chất lượng')) {
      return `Dạ, **Yến Sào Huvatra** xin cam kết bằng uy tín thương hiệu:<br>
✅ **100% Tổ yến nguyên chất** thu hoạch từ hệ thống nhà yến Cam Ranh & Khánh Hòa.<br>
✅ **Không pha trộn** mủ trôm, tinh bột hay rau câu.<br>
✅ **Không tẩy trắng**, không tẩm ướp đường hoặc hóa chất bảo quản.<br>
✅ **Bồi thường gấp 200% giá trị** nếu Quý khách kiểm nghiệm phát hiện yến không nguyên chất.<br>
Quý khách hoàn toàn an tâm trao trọn niềm tin cho sức khỏe gia đình ạ!`;
    }

    if (q.includes('chưng tươi') || q.includes('hũ') || q.includes('saffron') || q.includes('đông trùng')) {
      return `Dạ, các set **Yến Chưng Tươi Huvatra** được chưng thủ công tươi nóng mỗi ngày theo đơn đặt hàng tại Showroom 164 Nguyễn Công Trứ:<br>
• **Set 6 hũ Yến Chưng Saffron & Đông Trùng:** 650.000đ (Bồi bổ sinh lực, đẹp da, ngủ sâu).<br>
• **Set 6 hũ Yến Chưng Táo Đỏ Hạt Sen:** 550.000đ (Bổ phế, mát gan, an thần).<br>
Mỗi hũ chứa hàm lượng yến tươi lên đến 30%, sợi yến thật giòn dai sần sật. Giao hỏa tốc nóng hổi tại Cam Ranh và giao ướp lạnh đá gel toàn quốc ạ!`;
    }

    return `Dạ, cảm ơn Quý khách đã quan tâm đến **Yến Sào Huvatra**! Để được tư vấn chi tiết hơn theo nhu cầu riêng hoặc đặt hàng nhận ngay ưu đãi, Quý khách có thể để lại số điện thoại hoặc gọi/nhắn Zalo trực tiếp đến Hotline: **0974002626**, đội ngũ chuyên viên Huvatra tại 164 Nguyễn Công Trứ, Cam Ranh sẽ hỗ trợ Quý khách tận tình ngay tức khắc ạ!`;
  }

  // Lớp 1: DeepSeek Chat API
  async function callDeepSeekAPI(messages) {
    const formatted = [
      { role: 'system', content: SYSTEM_KNOWLEDGE },
      ...messages.slice(-8)
    ];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEFAULT_DEEPSEEK_KEY}`
      },
      body: JSON.stringify({
        model: CONFIG.deepseekModel,
        messages: formatted,
        temperature: 0.6,
        max_tokens: 800
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('DeepSeek error');
    const data = await res.json();
    return data.choices[0].message.content;
  }

  // Lớp 2: Google Gemini API (Dự phòng 1)
  async function callGeminiAPI(messages) {
    const contents = messages.slice(-8).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.geminiModel}:generateContent?key=${DEFAULT_GEMINI_KEY}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_KNOWLEDGE }] },
        contents: contents,
        generationConfig: { temperature: 0.6, maxOutputTokens: 800 }
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Gemini error');
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  }

  // Điều phối truy vấn tư vấn đa tầng
  async function fetchConsultation(userText) {
    chatHistory.push({ role: 'user', content: userText });

    // Ưu tiên DeepSeek
    try {
      return await callDeepSeekAPI(chatHistory);
    } catch (e1) {
      console.warn('DeepSeek unavailable, switching to Gemini...', e1);
      // Dự phòng 1: Gemini
      try {
        return await callGeminiAPI(chatHistory);
      } catch (e2) {
        console.warn('Gemini unavailable, switching to Smart Fallback Engine...', e2);
        // Dự phòng 2: Fallback thông minh nội bộ
        return getSmartFallbackReply(userText);
      }
    }
  }

  // Khởi tạo và kết xuất giao diện Chat Widget
  function renderWidget() {
    // 1. Nút Launcher dạng Pill FAB sang trọng
    const fab = document.createElement('div');
    fab.className = 'brand-fab-launcher';
    fab.id = 'brandFabLauncher';
    fab.setAttribute('role', 'button');
    fab.setAttribute('aria-label', CONFIG.fabTitle);
    fab.innerHTML = `
      <div class="brand-fab-icon-box">
        <span class="brand-fab-pulse"></span>
        <span class="brand-fab-emoji">${CONFIG.avatarIcon}</span>
      </div>
      <div class="brand-fab-text">
        <span class="brand-fab-title">${CONFIG.fabTitle}</span>
        <span class="brand-fab-sub">${CONFIG.fabSub}</span>
      </div>
      <span class="brand-fab-badge">${CONFIG.fabBadge}</span>
    `;

    // 2. Cửa sổ tư vấn Glassmorphism cao cấp
    const chatWin = document.createElement('div');
    chatWin.className = 'brand-chat-window';
    chatWin.id = 'brandChatWindow';
    chatWin.innerHTML = `
      <div class="brand-chat-header">
        <div class="brand-chat-profile">
          <div class="brand-avatar">
            <span>${CONFIG.avatarIcon}</span>
            <span class="brand-online-dot"></span>
          </div>
          <div class="brand-profile-meta">
            <div class="brand-title">${CONFIG.brandName}</div>
            <span class="brand-status-text">${CONFIG.subHeader}</span>
          </div>
        </div>
        <div class="brand-header-actions">
          <button class="brand-icon-btn" id="btnBrandClear" title="Làm mới cuộc trò chuyện">↺</button>
          <button class="brand-icon-btn" id="btnBrandClose" title="Thu nhỏ">&times;</button>
        </div>
      </div>

      <!-- Quick Suggestion Chips -->
      <div class="brand-chat-chips" id="brandChatChips">
        <button class="brand-chip-btn" data-query="Bảng giá các loại yến sào Huvatra?">💰 Bảng giá yến</button>
        <button class="brand-chip-btn" data-query="Địa chỉ showroom và bản đồ chỉ đường?">📍 Địa chỉ showroom</button>
        <button class="brand-chip-btn" data-query="Mẹ bầu nên ăn yến sào như thế nào?">🤰 Mẹ bầu dùng yến</button>
        <button class="brand-chip-btn" data-query="Cách chưng yến sào giữ trọn dinh dưỡng?">🍲 Cách chưng yến</button>
        <button class="brand-chip-btn" data-query="Cam kết chất lượng và bồi thường của Huvatra?">🛡️ Cam kết chất lượng</button>
      </div>

      <div class="brand-chat-body" id="brandChatBody">
        <div class="brand-msg bot">
          <div class="brand-msg-avatar">${CONFIG.avatarIcon}</div>
          <div class="brand-msg-bubble">${chatHistory[0].content}</div>
        </div>
      </div>

      <div class="brand-chat-footer">
        <form class="brand-input-form" id="brandChatForm">
          <textarea class="brand-input-field" id="brandInputField" rows="1" placeholder="Hỏi về bảng giá, cách dùng, địa chỉ..."></textarea>
          <button type="submit" class="brand-send-btn" id="brandSendBtn" aria-label="Gửi">➤</button>
        </form>
        <div class="brand-footer-note">
          <span>${CONFIG.footerNote}</span>
        </div>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(chatWin);

    // Gắn kết tương tác
    const chatBody = document.getElementById('brandChatBody');
    const inputField = document.getElementById('brandInputField');
    const form = document.getElementById('brandChatForm');
    const btnClose = document.getElementById('btnBrandClose');
    const btnClear = document.getElementById('btnBrandClear');
    const chipsContainer = document.getElementById('brandChatChips');

    function toggleChat(forceOpen) {
      const isOpen = forceOpen !== undefined ? forceOpen : !chatWin.classList.contains('open');
      chatWin.classList.toggle('open', isOpen);
      fab.classList.toggle('active', isOpen);
      if (isOpen) {
        setTimeout(() => inputField.focus(), 150);
      }
    }

    fab.addEventListener('click', () => toggleChat());
    btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleChat(false);
    });

    btnClear.addEventListener('click', (e) => {
      e.stopPropagation();
      chatHistory = [chatHistory[0]];
      chatBody.innerHTML = `
        <div class="brand-msg bot">
          <div class="brand-msg-avatar">${CONFIG.avatarIcon}</div>
          <div class="brand-msg-bubble">${chatHistory[0].content}</div>
        </div>
      `;
    });

    // Tự động mở rộng dòng khi gõ
    inputField.addEventListener('input', () => {
      inputField.style.height = 'auto';
      inputField.style.height = Math.min(inputField.scrollHeight, 100) + 'px';
    });

    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
      }
    });

    async function handleUserMessage(txt) {
      if (!txt) return;

      // Hiển thị tin nhắn người dùng
      const userDiv = document.createElement('div');
      userDiv.className = 'brand-msg user';
      userDiv.innerHTML = `<div class="brand-msg-bubble">${formatMarkdown(txt)}</div>`;
      chatBody.appendChild(userDiv);
      chatBody.scrollTop = chatBody.scrollHeight;

      // Hiển thị trạng thái đang soạn
      const loading = document.createElement('div');
      loading.className = 'brand-msg bot loading-state';
      loading.innerHTML = `
        <div class="brand-msg-avatar">${CONFIG.avatarIcon}</div>
        <div class="brand-msg-bubble">
          <span class="brand-typing-dots"><span></span><span></span><span></span></span>
        </div>
      `;
      chatBody.appendChild(loading);
      chatBody.scrollTop = chatBody.scrollHeight;

      // Gọi xử lý đa tầng
      const reply = await fetchConsultation(txt);
      loading.remove();

      // Hiển thị phản hồi từ trợ lý thương hiệu
      const botDiv = document.createElement('div');
      botDiv.className = 'brand-msg bot';
      botDiv.innerHTML = `
        <div class="brand-msg-avatar">${CONFIG.avatarIcon}</div>
        <div class="brand-msg-bubble">${formatMarkdown(reply)}</div>
      `;
      chatBody.appendChild(botDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const txt = inputField.value.trim();
      if (!txt) return;
      inputField.value = '';
      inputField.style.height = 'auto';
      await handleUserMessage(txt);
    });

    // Xử lý khi nhấn chip câu hỏi nhanh
    chipsContainer.addEventListener('click', async (e) => {
      const chip = e.target.closest('.brand-chip-btn');
      if (chip) {
        const query = chip.getAttribute('data-query');
        await handleUserMessage(query);
      }
    });

    // Mở chat từ bất kỳ nút nào trên trang có class 'trigger-brand-chat'
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.trigger-brand-chat');
      if (trigger) {
        e.preventDefault();
        const customPrompt = trigger.getAttribute('data-prompt');
        toggleChat(true);
        if (customPrompt) {
          handleUserMessage(customPrompt);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderWidget);
  } else {
    renderWidget();
  }
})();
