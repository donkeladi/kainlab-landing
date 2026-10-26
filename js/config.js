/*
  Tetapan aktiviti & promo Kainlab.
  Isi HANYA maklumat sebenar. Jika kosong / enabled:false, popup dan bar promo tidak dipaparkan.

  activity: tempahan atau sebut harga SEBENAR yang baru diterima (guna nama dengan kebenaran pelanggan,
            atau nama pendek/first name). Contoh satu entri:
            { name: 'Kamarul', action: 'membuat sebut harga', item: 'Baju Korporat', when: '2 jam lalu' }

  promo:    kempen sebenar yang ada tarikh tamat. 'endsAt' ialah masa tamat (format ISO, waktu Malaysia +08:00).
            Letak 'slots' hanya jika bilangan slot benar-benar terhad.
            Contoh: { enabled: true, text: 'Slot cetakan Disember hampir penuh.', endsAt: '2026-12-05T23:59:59+08:00',
                      slots: 'Tinggal 6 slot', cta: 'Tempah sekarang', url: '#tempah' }
*/
window.KAINLAB_CONFIG = {
  activity: [],
  promo: { enabled: false, text: '', endsAt: '', slots: '', cta: 'Tempah sekarang', url: '#tempah' }
};
