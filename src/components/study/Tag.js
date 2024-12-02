import React, { useCallback, useEffect, useState } from 'react';

import '../../css/tag_css/Tag.css';

const Tag = React.memo(({ onTagChange, tags }) => {
    const [hashtag, setHashtag] = useState('');
    const [tagString, setTagString] = useState(tags);

    useEffect(() => {
        if (typeof tags === 'string') {
            setTagString(tags);
        }
        console.log("tag type of " + typeof tags);
    }, [tags]);

    const onChangeHashtag = (e) => {
        setHashtag(e.target.value);
    };

    const onKeyUp = useCallback(
        (e) => {
            if (e.keyCode === 188 && e.target.value.trim() !== '') {
                const newHashTag = e.target.value.replace(/,/g, '').trim();
                const currentTags = tagString.length > 0
                    ? tagString.split(',').map((tag) => tag.trim())
                    : [];

                // 중복 방지와 최대 5개 제한 로직 추가
                if (currentTags.includes(newHashTag)) {
                    alert('이미 추가된 태그입니다.');
                } else if (currentTags.length >= 5) {
                    alert('태그는 최대 5개까지 추가할 수 있습니다.');
                } else {
                    const updatedTags = [...currentTags, newHashTag].join(',');
                    setTagString(updatedTags);
                }

                setHashtag('');
                e.target.value = '';
            }
        },
        [tagString]
    );


    const removeTag = (clickedTag) => {
        const updatedTagString = tagString
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag !== clickedTag)
            .join(',');

        setTagString(updatedTagString || '');
    };

    useEffect(() => {
        onTagChange(tagString);
    }, [tagString, onTagChange]);

    const tagArray = tagString.length > 0 ? tagString.split(',').map((tag) => tag.trim()) : "";

    return (
        <div className="tag_wrapper">
            {tagArray.length > 0 && (
                <div className="tag_list">
                    {tagArray.map((tag, index) => (
                        <div
                            key={index}
                            className="HashWrapInner"
                            onClick={() => removeTag(tag)}
                        >
                            #{tag}
                        </div>
                    ))}
                </div>
            )}
            <input
                className="tag_input"
                type="text"
                name="tag"
                value={hashtag}
                onChange={onChangeHashtag}
                onKeyUp={onKeyUp}
                placeholder="해시태그 입력"
            />
        </div>
    );
});

export default Tag;

