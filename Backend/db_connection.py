import psycopg2

DB_HOST = 'know-bot.postgres.database.azure.com'
DB_NAME = 'knowbot_data'
DB_USER = 'knowbot'
DB_PASS = 'Ceg@2024' 


def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    return conn