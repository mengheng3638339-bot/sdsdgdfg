# Khmer SRT Store — គេហទំព័រគំរូ

## របៀបប្រើ
1. Extract ZIP។
2. បើក `index.html` ក្នុង Chrome, Edge ឬ Firefox។
3. អាចបង្ហោះ folder នេះទៅ Cloudflare Pages ឬ GitHub Pages។

## លេខក្បាលកូដ Active
- `147……` = 1 សប្ដាហ៍ (7 ថ្ងៃ)
- `14……` = 2 សប្ដាហ៍ (14 ថ្ងៃ)
- `30……` = 1 ខែ (30 ថ្ងៃ)
- `60……` = 2 ខែ (60 ថ្ងៃ)
- `90……` = 3 ខែ (90 ថ្ងៃ)
- `120….` = 4 ខែ (120 ថ្ងៃ)
- `365….` = 1 ឆ្នាំ (365 ថ្ងៃ)

## ប្រវែងកូដ Active
- `30`, `60`, `90` = សរុប 26 ខ្ទង់
- `14` = សរុប 26 ខ្ទង់
- `147`, `120`, `365` = សរុប 27 ខ្ទង់

## ការទូទាត់ KHQR
- បើក `app.js` ហើយកែ `KHQR_CONFIG.bakongId` ទៅជា Bakong Account ID របស់អ្នក (ឧ. `yourname@bank`)។
- កែ `merchantName`, `city`, `currency` (840=USD, 116=KHR) តាមត្រូវការ។
- ពេលអតិថិជនបំពេញទម្រង់ នឹងបង្ហាញ KHQR ថាមវន្ត (dynamic) ដែលមានចំនួនទឹកប្រាក់ និងលេខសំណើ ហើយមានសុពលភាព 15 នាទី។
- ការផ្ទៀងផ្ទាត់ការទូទាត់ត្រូវធ្វើដោយដៃ (ឬតាម backend/Bakong API នៅពេលក្រោយ)។

## សំខាន់
នេះជា frontend prototype ប៉ុណ្ណោះ។ សំណើទិញត្រូវបានទាញយកជា JSON ក្នុង browser មិនបានផ្ញើទៅ server ទេ។ មិនទាន់មាន backend/database, KHQR verification, Admin dashboard ឬការបង្កើត/ផ្ញើកូដ Active ដោយស្វ័យប្រវត្តិទេ។ កុំដាក់ Telegram Bot Token ក្នុង HTML ឬ JavaScript ខាងមុខ browser។
