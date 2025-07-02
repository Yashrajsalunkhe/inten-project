import matplotlib.pyplot as plt
import io
import base64

def generate_bar_chart(df, col):
    fig, ax = plt.subplots()
    df[col].value_counts().plot(kind='bar', ax=ax)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close(fig)
    return base64.b64encode(buf.read()).decode('utf-8')

def generate_pie_chart(df, col):
    fig, ax = plt.subplots()
    df[col].value_counts().plot(kind='pie', ax=ax, autopct='%1.1f%%')
    ax.set_ylabel('')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close(fig)
    return base64.b64encode(buf.read()).decode('utf-8')

def generate_line_chart(df, x_col, y_col):
    fig, ax = plt.subplots()
    df.groupby(x_col)[y_col].sum().plot(kind='line', ax=ax)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close(fig)
    return base64.b64encode(buf.read()).decode('utf-8')
