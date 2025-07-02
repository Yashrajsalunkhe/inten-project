import os
import requests
import json as pyjson
from utils.chart_generator import generate_bar_chart, generate_pie_chart, generate_line_chart

def ask_gemini(message, columns):
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return None, '❗ Gemini API key not set in environment.'

    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={api_key}'
    
    prompt = f"""
You are a data assistant. Given the following columns: {columns}, and the user query: '{message}',
1. Suggest a pandas code snippet to answer the query (use only the columns provided, DataFrame is named df).
2. Give a short summary of what the code does.
Respond in JSON: {{"code": "...", "summary": "..."}}
"""

    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    try:
        resp = requests.post(url, json=data)
        resp.raise_for_status()
        text = resp.json()['candidates'][0]['content']['parts'][0]['text']
        result = pyjson.loads(text)
        return result.get('code'), result.get('summary')

    except requests.exceptions.HTTPError as e:
        if resp.status_code == 429:
            return None, '⚠️ Gemini API rate limit exceeded. Please try again later.'
        return None, f'Gemini HTTP error: {e}'
    except Exception as e:
        return None, f'Gemini error: {e}'

def generate_response(message, df):
    if df is None:
        return {'reply': '❗ No file uploaded yet.'}
    
    msg = message.lower()

    # 1. Show columns
    if 'column' in msg:
        return {'reply': f'📄 Columns: {list(df.columns)}'}

    # 2. Row count
    elif 'row' in msg:
        return {'reply': f'🔢 Total rows: {len(df)}'}

    # 3. Bar chart
    elif 'bar chart' in msg:
        for col in df.columns:
            if col.lower() in msg:
                img = generate_bar_chart(df, col)
                return {'reply': f'📊 Bar chart for {col}', 'chart': f'data:image/png;base64,{img}'}
        return {'reply': 'Please specify a valid column for the bar chart.'}

    # 4. Pie chart
    elif 'pie chart' in msg:
        for col in df.columns:
            if col.lower() in msg:
                img = generate_pie_chart(df, col)
                return {'reply': f'🥧 Pie chart for {col}', 'chart': f'data:image/png;base64,{img}'}
        return {'reply': 'Please specify a valid column for the pie chart.'}

    # 5. Line chart
    elif 'line chart' in msg and 'by' in msg:
        parts = msg.split('line chart of')[-1].split('by')
        if len(parts) == 2:
            y_col = parts[0].strip()
            x_col = parts[1].strip()
            cols_lower = [c.lower() for c in df.columns]
            if y_col in cols_lower and x_col in cols_lower:
                y_real = [c for c in df.columns if c.lower() == y_col][0]
                x_real = [c for c in df.columns if c.lower() == x_col][0]
                img = generate_line_chart(df, x_real, y_real)
                return {'reply': f'📈 Line chart of {y_real} by {x_real}', 'chart': f'data:image/png;base64,{img}'}
        return {'reply': 'Please specify valid columns for line chart (e.g. "line chart of sales by month").'}

    # 6. Basic statistics
    elif 'sum of' in msg or 'total of' in msg:
        for col in df.columns:
            if col.lower() in msg:
                val = df[col].sum()
                return {'reply': f'Σ Sum of {col}: {val}'}
        return {'reply': 'Please specify a valid column for sum.'}

    elif 'average of' in msg or 'mean of' in msg:
        for col in df.columns:
            if col.lower() in msg:
                val = df[col].mean()
                return {'reply': f'📊 Average of {col}: {val}'}
        return {'reply': 'Please specify a valid column for average.'}

    elif 'count of' in msg:
        for col in df.columns:
            if col.lower() in msg:
                val = df[col].count()
                return {'reply': f'🔢 Count of {col}: {val}'}
        return {'reply': 'Please specify a valid column for count.'}

    elif 'average by' in msg or 'mean by' in msg:
        for col in df.columns:
            if col.lower() in msg:
                group_col = col
                break
        else:
            return {'reply': 'Please specify a valid column for group by.'}
        means = df.groupby(group_col).mean(numeric_only=True)
        return {'reply': f'📊 Average by {group_col}:\n{means.to_string()}'}

    # 7. Fallback: Ask Gemini
    code, summary = ask_gemini(message, list(df.columns))
    if code:
        try:
            local_vars = {'df': df}
            exec(f"result = {code}", {"__builtins__": {}}, local_vars)
            result = local_vars['result']
            return {'reply': f"🤖 Gemini: {summary}\n\n📄 Result: {str(result)}"}
        except Exception as e:
            return {'reply': f"⚠️ Gemini code error: {e}\n\n🧪 Code: {code}"}
    else:
        return {'reply': summary or '❌ Sorry, I could not process your request.'}
