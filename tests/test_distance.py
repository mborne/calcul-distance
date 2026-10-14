import pytest

from calcul_distance.distance import haversine


def test_meme_point():
    assert haversine(2.35, 48.85, 2.35, 48.85) == 0


def test_symetrie():
    assert haversine(2.35, 48.85, 4.83, 45.76) == pytest.approx(haversine(4.83, 45.76, 2.35, 48.85))


def test_paris_lyon():
    # Paris (2.3522, 48.8566) - Lyon (4.8357, 45.7640) : environ 392 km
    assert haversine(2.3522, 48.8566, 4.8357, 45.7640) == pytest.approx(392, abs=2)


def test_quart_de_meridien():
    # équateur -> pôle Nord : pi/2 * R
    assert haversine(0, 0, 0, 90) == pytest.approx(10007.6, abs=0.5)
