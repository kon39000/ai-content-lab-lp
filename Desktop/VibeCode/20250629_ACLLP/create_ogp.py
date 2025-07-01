from PIL import Image, ImageDraw, ImageFont
import os

def create_ogp_image():
    # OGP画像のサイズ (1200x630)
    width, height = 1200, 630
    
    # グラデーション背景を作成
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    # グラデーション効果（簡単な方法）
    for y in range(height):
        # 上から下へのグラデーション
        r = int(102 + (118 - 102) * y / height)  # 667eea -> 764ba2
        g = int(126 + (75 - 126) * y / height)
        b = int(234 + (162 - 234) * y / height)
        color = (r, g, b)
        draw.line([(0, y), (width, y)], fill=color)
    
    # フォントを設定（システムフォントを使用）
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc", 80)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc", 40)
        price_font = ImageFont.truetype("/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc", 50)
    except:
        # フォントが見つからない場合はデフォルトフォント
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        price_font = ImageFont.load_default()
    
    # テキストを描画
    # タイトル
    title_text = "毎日コツコツ、\n一緒に歩む\nAIコンテンツラボ"
    draw.multiline_text((60, 100), title_text, font=title_font, fill='white', spacing=10)
    
    # サブタイトル
    subtitle_text = "月額制AI学習コミュニティ"
    draw.text((60, 400), subtitle_text, font=subtitle_font, fill='white')
    
    # 価格
    price_text = "月額2,980円"
    # 価格の背景（角丸四角形風）
    draw.rounded_rectangle([60, 480, 300, 550], radius=25, fill=(255, 255, 255, 60))
    draw.text((80, 495), price_text, font=price_font, fill='white')
    
    # 装飾的な要素を追加
    # 大きな円（背景装飾）
    draw.ellipse([900, -100, 1400, 400], fill=(255, 255, 255, 20))
    draw.ellipse([-100, 400, 400, 900], fill=(255, 255, 255, 15))
    
    # キャラクター代わりの円形要素
    draw.ellipse([850, 150, 1050, 350], fill=(255, 255, 255, 30), outline='white', width=3)
    draw.ellipse([870, 170, 1030, 330], fill=(255, 215, 0, 80))  # 金色の円
    
    # 小さな装飾円
    draw.ellipse([950, 100, 1000, 150], fill=(255, 255, 255, 40))
    draw.ellipse([800, 400, 850, 450], fill=(255, 255, 255, 40))
    draw.ellipse([1050, 300, 1100, 350], fill=(255, 255, 255, 40))
    
    # 画像を保存
    image.save('ogp-image.png', 'PNG')
    print("OGP画像を生成しました: ogp-image.png")

if __name__ == "__main__":
    create_ogp_image()