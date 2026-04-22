var express = require('express');
var router = express.Router();
var firstImage = require('../modules/firstimage');
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');

// GET: Trang chủ
router.get('/', async (req, res) => {
	// Lấy chuyên mục hiển thị vào Menu và Thẻ
	var cm = await ChuDe
		.find()
		.sort({ TenChuDe: 1 })
		.exec();
	
	// Lấy 12 bài viết mới nhất và đã duyệt vào trung tâm
	var bv = await BaiViet
		.find({ KiemDuyet: 1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.sort({ NgayDang: -1 })
		.limit(12)
		.exec();
	
	// Lấy 3 bài viết xem nhiều nhất vào bên phải
	var xnn = await BaiViet
		.find({ KiemDuyet: 1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.sort({ LuotXem: -1 })
		.limit(3)
		.exec();
	
	// Hiển thị ra trang chủ
	res.render('index', {
		title: 'Trang chủ',
		chuyenmuc: cm,
		baiviet: bv,
		xemnhieunhat: xnn,
		firstImage: firstImage
	});	
});

// GET: Lấy các bài viết cùng mã chủ đề
router.get('/baiviet/chude/:id', async (req, res) => {
	// Lấy id chủ đề từ URL
	var id = req.params.id;
	
	// Lấy tên chủ đề hiển thị vào đầu trang
	var cd = await ChuDe.findById(id);
	
	// Lấy 8 bài viết mới nhất cùng chuyên mục và đã duyệt vào trung tâm
	var bv = await BaiViet
		.find({ KiemDuyet: 1, ChuDe: id })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.sort({ NgayDang: -1 })
		.limit(8)
		.exec();
	
	// Lấy chuyên mục hiển thị vào Menu và Thẻ
	var cm = await ChuDe
		.find()
		.sort({ TenChuDe: 1 })
		.exec();
	
	// Lấy 3 bài viết xem nhiều nhất vào bên phải
	var xnn = await BaiViet
		.find({ KiemDuyet: 1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.sort({ LuotXem: -1 })
		.limit(3)
		.exec();
	
	// Hiển thị kết quả
	res.render('baiviet_chude', {
		title: cd.TenChuDe,
		chude: cd,
		chuyenmuc: cm,
		baiviet: bv,
		xemnhieunhat: xnn,
		firstImage: firstImage
	});
});

// GET: Xem bài viết
router.get('/baiviet/chitiet/:id', async (req, res) => {
	// Lấy id bài viết từ URL
	var id = req.params.id;
	
	// Lấy chuyên mục hiển thị vào Menu và Thẻ
	var cm = await ChuDe
		.find()
		.sort({ TenChuDe: 1 })
		.exec();
	
	// Lấy 3 bài viết xem nhiều nhất vào bên phải
	var xnn = await BaiViet
		.find({ KiemDuyet: 1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.sort({ LuotXem: -1 })
		.limit(3)
		.exec();
		
	// Lấy bài viết có id phù hợp
	var bv = await BaiViet.findById(id)
		.populate('ChuDe')
		.populate('TaiKhoan')
		.exec();
		
	// Kết xuất
	res.render('baiviet_chitiet', {
		chuyenmuc: cm,
		baiviet: bv,
		xemnhieunhat: xnn,
		firstImage: firstImage
	});
});

// GET: Tin mới nhất
router.get('/tinmoi', async (req, res) => {
	res.render('tinmoinhat', {
		title: 'Tin mới nhất'
	});
});

// POST: Kết quả tìm kiếm
router.post('/timkiem', async (req, res) => {
	var tukhoa = req.body.tukhoa;
	
	// Xử lý tìm kiếm bài viết
	var bv = [];
	
	res.render('timkiem', {
		title: 'Kết quả tìm kiếm',
		baiviet: bv,
		tukhoa: tukhoa
	});
});

// GET: Lỗi
router.get('/error', async (req, res) => {
	res.render('error', {
		title: 'Lỗi'
	});
});

// GET: Thành công
router.get('/success', async (req, res) => {
	res.render('success', {
		title: 'Hoàn thành'
	});
});

module.exports = router;