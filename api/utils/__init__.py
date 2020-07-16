import string
import random

def random_string(string_length):
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(string_length))

def generate_token():
    random_string(20)