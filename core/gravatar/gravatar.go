package gravatar

import (
	"crypto/md5"
	"fmt"
	"strings"

	"github.com/deluan/navidrome/utils"
)

const baseUrl = "https://www.gravatar.com/avatar"
const defaultSize = 80
const maxSize = 2048

func Url(email string, size int) string {
	email = strings.ToLower(email)
	email = strings.TrimSpace(email)
	hash := md5.Sum([]byte(email))
	if size < 1 {
		size = defaultSize
	}
	size = utils.MinInt(maxSize, size)

	return fmt.Sprintf("%s/%x?s=%d", baseUrl, hash, size)
}
